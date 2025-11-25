import mongoose from 'mongoose';

// 링크 스키마 (배열 내부 객체)
const linkSchema = new mongoose.Schema({
  label: { type: String },
  url: { type: String }
}, { _id: false });

// 학력 스키마
const educationSchema = new mongoose.Schema({
  school: { type: String },
  major: { type: String },
  degree: { type: String },
  period: { type: String },
  activities: { type: String }
}, { _id: false });

// 경력 스키마
const experienceSchema = new mongoose.Schema({
  company: { type: String },
  position: { type: String },
  workType: { type: String },
  period: { type: String },
  duties: { type: String },
  achievements: { type: String }
}, { _id: false });

// 프로젝트 스키마
const projectSchema = new mongoose.Schema({
  name: { type: String },
  organization: { type: String },
  period: { type: String },
  role: { type: String },
  description: { type: String },
  result: { type: String }
}, { _id: false });

// 자격증 스키마
const certificationSchema = new mongoose.Schema({
  name: { type: String },
  issuer: { type: String },
  date: { type: String }
}, { _id: false });

// 수상 스키마
const awardSchema = new mongoose.Schema({
  name: { type: String },
  issuer: { type: String },
  date: { type: String },
  description: { type: String }
}, { _id: false });

// 메인 프로필 스키마
const profileSchema = new mongoose.Schema({
  basicInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    links: [linkSchema]
  },

  jobPreference: {
    desiredPosition: { type: String },
    careerLevel: { type: String, default: '신입' },
    workType: { type: String, default: '정규직' },
    industry: { type: String }
  },

  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],

  skills: {
    jobSkills: { type: String },
    tools: { type: String },
    languages: { type: String },
    softSkills: { type: String }
  },

  certifications: [certificationSchema],
  awards: [awardSchema],

  summary: {
    oneLine: { type: String },
    keywords: { type: String },
    notes: { type: String }
  }
}, {
  timestamps: true  // createdAt, updatedAt 자동 생성
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
