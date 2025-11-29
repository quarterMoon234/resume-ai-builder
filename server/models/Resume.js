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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },
    type: {
      type: String,
      enum: ['basic', 'custom', 'designed'],
      required: true
    },
    companyName: {
      type: String,
      default: null
    },
    // 디자인 이력서용 필드 추가
    templateId: {
      type: String,
      default: null
    },
    layout: {
      type: Object,
      default: null
    },
    // 컨설팅 리포트 필드 추가
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
