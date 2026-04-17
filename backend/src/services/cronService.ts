import cron from 'node-cron';
import Complaint, { IComplaint } from '../models/Complaint';
import Escalation from '../models/Escalation';
import User from '../models/User';
import { emitNotification } from './socketService';
import mongoose from 'mongoose';

const ESCALATION_THRESHOLD_HOURS = 72; // 72 hours

export const startCronJob = () => {
  // Schedule to run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running complaint escalation check...');
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - ESCALATION_THRESHOLD_HOURS * 60 * 60 * 1000);

    try {
      const complaintsToEscalate: IComplaint[] = await Complaint.find({
        status: { $in: ['approved', 'in_progress'] },
        createdAt: { $lte: thresholdDate },
        escalatedAt: { $exists: false } // Only escalate once
      });

      for (const complaint of complaintsToEscalate) {
        // Update complaint status to escalated
        complaint.status = 'escalated';
        complaint.escalatedAt = now;
        await complaint.save();

        // Create an escalation record
        await Escalation.create({
          complaintId: complaint._id,
          escalatedAt: now,
          status: 'pending'
        });

        // Notify Admin
        const admins = await User.find({ role: 'admin' });
        for (const admin of admins) {
          await emitNotification(
            admin._id,
            `Complaint #${complaint._id.toString().slice(-6)} has been escalated!`,
            'complaint_escalated',
            complaint._id as mongoose.Schema.Types.ObjectId
          );
        }

        // Notify Student
        await emitNotification(
          complaint.userId,
          `Your complaint #${complaint._id.toString().slice(-6)} has been escalated to Admin.`,
          'complaint_escalated',
          complaint._id as mongoose.Schema.Types.ObjectId
        );

        console.log(`Complaint ${complaint._id} escalated.`);
      }
    } catch (error) {
      console.error('Error during complaint escalation cron job:', error);
    }
  });
  console.log('Complaint escalation cron job started.');
};