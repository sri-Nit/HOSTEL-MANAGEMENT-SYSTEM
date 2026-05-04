import cron from 'node-cron';
import { supabase } from './supabaseClient';

const ESCALATION_THRESHOLD_HOURS = Number(process.env.ESCALATION_THRESHOLD_HOURS || 0);
const ESCALATION_CRON_SCHEDULE = process.env.ESCALATION_CRON_SCHEDULE || '* * * * *';

console.log('🚀 ESCALATION SYSTEM BOOTED');
console.log('Threshold Hours:', ESCALATION_THRESHOLD_HOURS);

export const checkComplaintEscalations = async () => {
  console.log('\n🔍 Running escalation check...');

  const now = new Date();
  const thresholdDate = new Date(
    now.getTime() - ESCALATION_THRESHOLD_HOURS * 60 * 60 * 1000
  );

  try {
    // STEP 1: Get approved complaints
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('status', 'approved');

    if (error) {
      console.error('❌ Supabase error:', error);
      return 0;
    }

    if (!complaints || complaints.length === 0) {
      console.log('⚠️ No complaints found');
      return 0;
    }

    console.log(`📦 Total complaints: ${complaints.length}`);

    // STEP 2: Filter in JS (safe approach)
    const toEscalate = complaints.filter((c) => {
      const createdAt = new Date(c.created_at);
      return createdAt <= thresholdDate && !c.escalated_at;
    });

    console.log(`🚨 Complaints to escalate: ${toEscalate.length}`);

    if (toEscalate.length === 0) return 0;

    // STEP 3: Process escalation
    for (const complaint of toEscalate) {
      console.log(`⚙️ Escalating: ${complaint.id}`);

      // update complaint
      await supabase
        .from('complaints')
        .update({
          status: 'escalated',
          escalated_at: now.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', complaint.id);

      // insert escalation record
      await supabase.from('escalations').insert([
        {
          complaint_id: complaint.id,
          escalated_at: now.toISOString(),
          status: 'pending'
        }
      ]);

      // get admins
      const { data: admins } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'admin');

      // ADMIN NOTIFICATIONS
      for (const admin of admins || []) {
        await supabase.from('notifications').insert([
          {
            user_id: admin.id,
            message: `Complaint #${complaint.id.slice(-6)} escalated!`,
            type: 'complaint_escalated',
            complaint_id: complaint.id
          }
        ]);
      }

      // USER NOTIFICATION
      await supabase.from('notifications').insert([
        {
          user_id: complaint.user_id,
          message: `Your complaint #${complaint.id.slice(-6)} was escalated.`,
          type: 'complaint_escalated',
          complaint_id: complaint.id
        }
      ]);

      console.log(`✅ Escalated: ${complaint.id}`);
    }

    return toEscalate.length;

  } catch (error) {
    console.error('❌ Escalation error:', error);
    return 0;
  }
};

// CRON JOB
cron.schedule(ESCALATION_CRON_SCHEDULE, async () => {
  console.log('⏰ CRON FIRED');
  await checkComplaintEscalations();
});

export const startCronJob = () => {
  console.log(
    `🚀 Cron started | Schedule: ${ESCALATION_CRON_SCHEDULE} | Threshold: ${ESCALATION_THRESHOLD_HOURS}h`
  );
};