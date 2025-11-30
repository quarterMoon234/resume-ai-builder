import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    type: {
      type: String,
      enum: ['basic', 'designed'],
      required: true
    },
    // 디자인 이력서용 필드
    templateId: {
      type: String,
      default: null
    },
    layout: {
      type: Object,
      default: null
    },
    // 컨설팅 리포트 필드
    consultingReport: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
