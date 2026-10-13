import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'forge_admin_session';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  // Use service role key to bypass Row Level Security for admin operations, fallback to anon key if not set
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-key';

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session && session.value === 'true';
}

export async function GET() {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();

  try {
    // 1. Fetch Users (Profiles) - with nested relations if available
    let usersData: any[] = [];
    try {
      const { data: usersWithRel, error: relError } = await supabaseAdmin
        .from('profiles')
        .select('*, linked_wallets(*), savings_plans(*)')
        .order('created_at', { ascending: false });

      if (!relError && usersWithRel) {
        usersData = usersWithRel;
      } else {
        const { data: standaloneProfiles } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        usersData = standaloneProfiles || [];
      }
    } catch {
      const { data: fallbackProfiles } = await supabaseAdmin
        .from('profiles')
        .select('*');
      usersData = fallbackProfiles || [];
    }

    // 2. Fetch KYC Submissions
    let kycSubmissionsData: any[] = [];
    try {
      const { data: kycRes, error: kycErr } = await supabaseAdmin
        .from('kyc_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (!kycErr && kycRes) {
        kycSubmissionsData = kycRes;
      }
    } catch {
      kycSubmissionsData = [];
    }

    // 3. Fetch Transactions
    let transactionsData: any[] = [];
    try {
      const { data: txRes, error: txErr } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (!txErr && txRes) {
        transactionsData = txRes;
      } else {
        const { data: txFallback } = await supabaseAdmin
          .from('transactions')
          .select('*');
        transactionsData = txFallback || [];
      }
    } catch {
      transactionsData = [];
    }

    return NextResponse.json({
      success: true,
      users: usersData,
      kycSubmissions: kycSubmissionsData,
      transactions: transactionsData,
    });
  } catch (error: any) {
    console.error('Admin data fetch error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch admin data.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  const supabaseAdmin = getAdminClient();

  try {
    const payload = await req.json();
    const { action } = payload;

    switch (action) {
      case 'approve_deposit': {
        const { txId, userId, amountUsd } = payload;
        if (!txId) {
          return NextResponse.json({ error: 'Missing transaction ID.' }, { status: 400 });
        }

        // Update transaction status
        await supabaseAdmin
          .from('transactions')
          .update({ status: 'COMPLETED' })
          .eq('id', txId);

        // Credit user balance if userId and amount provided
        if (userId && amountUsd) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('base_balance_usd')
            .eq('id', userId)
            .maybeSingle();

          const currentBal = Number(profile?.base_balance_usd || 0);
          const newBal = currentBal + Number(amountUsd);

          await supabaseAdmin
            .from('profiles')
            .update({ base_balance_usd: newBal })
            .eq('id', userId);
        }

        return NextResponse.json({ success: true, message: 'Deposit approved successfully.' });
      }

      case 'reject_deposit': {
        const { txId, reason } = payload;
        if (!txId) {
          return NextResponse.json({ error: 'Missing transaction ID.' }, { status: 400 });
        }

        await supabaseAdmin
          .from('transactions')
          .update({
            status: 'REJECTED',
            rejection_reason: reason || 'Deposit proof verification failed.',
          })
          .eq('id', txId);

        return NextResponse.json({ success: true, message: 'Deposit rejected.' });
      }

      case 'approve_kyc': {
        const { userId, submissionId } = payload;
        if (!userId && !submissionId) {
          return NextResponse.json({ error: 'Missing user ID or submission ID.' }, { status: 400 });
        }

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({ kyc_status: 'verified' })
            .eq('id', userId);
        }

        try {
          if (submissionId) {
            await supabaseAdmin
              .from('kyc_submissions')
              .update({ status: 'verified', reviewed_at: new Date().toISOString() })
              .eq('id', submissionId);
          } else if (userId) {
            await supabaseAdmin
              .from('kyc_submissions')
              .update({ status: 'verified', reviewed_at: new Date().toISOString() })
              .eq('user_id', userId);
          }
        } catch {
          // Table may not exist
        }

        return NextResponse.json({ success: true, message: 'KYC approved.' });
      }

      case 'reject_kyc': {
        const { userId, submissionId, reason } = payload;
        if (!userId && !submissionId) {
          return NextResponse.json({ error: 'Missing user ID or submission ID.' }, { status: 400 });
        }

        const rejectionReason = reason || 'Document verification failed.';

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              kyc_status: 'rejected',
              kyc_rejection_reason: rejectionReason,
            })
            .eq('id', userId);
        }

        try {
          if (submissionId) {
            await supabaseAdmin
              .from('kyc_submissions')
              .update({
                status: 'rejected',
                rejection_reason: rejectionReason,
                reviewed_at: new Date().toISOString(),
              })
              .eq('id', submissionId);
          } else if (userId) {
            await supabaseAdmin
              .from('kyc_submissions')
              .update({
                status: 'rejected',
                rejection_reason: rejectionReason,
                reviewed_at: new Date().toISOString(),
              })
              .eq('user_id', userId);
          }
        } catch {
          // Table may not exist
        }

        return NextResponse.json({ success: true, message: 'KYC rejected.' });
      }

      case 'update_balance': {
        const { userId, newBalanceUSD } = payload;
        if (!userId || newBalanceUSD === undefined) {
          return NextResponse.json({ error: 'Missing user ID or balance.' }, { status: 400 });
        }

        await supabaseAdmin
          .from('profiles')
          .update({ 
            base_balance_usd: Number(newBalanceUSD),
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        try {
          await supabaseAdmin
            .from('transactions')
            .insert({
              user_id: userId,
              type: 'DEPOSIT',
              description: 'Administrative Treasury Credit',
              amount: Number(newBalanceUSD),
              currency: 'USD',
              status: 'COMPLETED',
            });
        } catch {}

        return NextResponse.json({ success: true, message: 'Balance updated.' });
      }

      case 'toggle_suspend': {
        const { userId, status } = payload;
        if (!userId || !status) {
          return NextResponse.json({ error: 'Missing user ID or status.' }, { status: 400 });
        }

        await supabaseAdmin
          .from('profiles')
          .update({ status })
          .eq('id', userId);

        return NextResponse.json({ success: true, message: `User status set to ${status}.` });
      }

      case 'update_user': {
        const { userId, name, email } = payload;
        if (!userId) {
          return NextResponse.json({ error: 'Missing user ID.' }, { status: 400 });
        }

        const updates: Record<string, string> = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        await supabaseAdmin
          .from('profiles')
          .update(updates)
          .eq('id', userId);

        return NextResponse.json({ success: true, message: 'User profile updated.' });
      }

      case 'delete_user': {
        const { userId } = payload;
        if (!userId) {
          return NextResponse.json({ error: 'Missing user ID.' }, { status: 400 });
        }

        await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', userId);

        return NextResponse.json({ success: true, message: 'User deleted.' });
      }

      case 'broadcast_notification': {
        const { recipientId, message } = payload;
        if (!message) {
          return NextResponse.json({ error: 'Missing message.' }, { status: 400 });
        }

        try {
          if (recipientId === 'ALL') {
            const { data: profiles } = await supabaseAdmin.from('profiles').select('id');
            if (profiles && profiles.length > 0) {
              const notifs = profiles.map((p) => ({
                user_id: p.id,
                message,
                read: false,
                created_at: new Date().toISOString(),
              }));
              await supabaseAdmin.from('notifications').insert(notifs);
            }
          } else {
            await supabaseAdmin.from('notifications').insert({
              user_id: recipientId,
              message,
              read: false,
              created_at: new Date().toISOString(),
            });
          }
        } catch {
          // Table may not exist
        }

        return NextResponse.json({ success: true, message: 'Notification broadcasted.' });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Admin mutation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to execute admin mutation.' },
      { status: 500 }
    );
  }
}
