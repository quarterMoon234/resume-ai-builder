import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  jobUrl: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String,
    trim: true
  },
  analysis: {
    type: String  // AI가 분석한 기업 정보
  },
  analyzedAt: {
    type: Date
  }
}, {
  timestamps: true  // createdAt, updatedAt 자동 생성
});

const Company = mongoose.model('Company', CompanySchema);

export default Company;
