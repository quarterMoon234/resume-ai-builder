import { useState } from 'react';
import axios from 'axios';

function ProfilePage() {
  // 전체 프로필 상태 관리
  const [profile, setProfile] = useState({
    basicInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      links: []
    },
    jobPreference: {
      desiredPosition: '',
      careerLevel: '신입',
      workType: '정규직',
      industry: ''
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      jobSkills: '',
      tools: '',
      languages: '',
      softSkills: ''
    },
    certifications: [],
    awards: [],
    summary: {
      oneLine: '',
      keywords: '',
      notes: ''
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedProfileId, setSavedProfileId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);

  // 기본 정보 업데이트
  const updateBasicInfo = (field, value) => {
    setProfile(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value }
    }));
  };

  // 링크 추가
  const addLink = () => {
    setProfile(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        links: [...prev.basicInfo.links, { url: '', label: '' }]
      }
    }));
  };

  // 링크 삭제
  const removeLink = (index) => {
    setProfile(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        links: prev.basicInfo.links.filter((_, i) => i !== index)
      }
    }));
  };

  // 링크 업데이트
  const updateLink = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        links: prev.basicInfo.links.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        )
      }
    }));
  };

  // 구직 방향 업데이트
  const updateJobPreference = (field, value) => {
    setProfile(prev => ({
      ...prev,
      jobPreference: { ...prev.jobPreference, [field]: value }
    }));
  };

  // 학력 추가
  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: '',
          major: '',
          degree: '',
          period: '',
          activities: ''
        }
      ]
    }));
  };

  // 학력 삭제
  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // 학력 업데이트
  const updateEducation = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // 경력 추가
  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: '',
          position: '',
          workType: '',
          period: '',
          duties: '',
          achievements: ''
        }
      ]
    }));
  };

  // 경력 삭제
  const removeExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // 경력 업데이트
  const updateExperience = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // 프로젝트 추가
  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: '',
          organization: '',
          period: '',
          role: '',
          description: '',
          result: ''
        }
      ]
    }));
  };

  // 프로젝트 삭제
  const removeProject = (index) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // 프로젝트 업데이트
  const updateProject = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  // 스킬 업데이트
  const updateSkills = (field, value) => {
    setProfile(prev => ({
      ...prev,
      skills: { ...prev.skills, [field]: value }
    }));
  };

  // 자격증 추가
  const addCertification = () => {
    setProfile(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: '',
          issuer: '',
          date: ''
        }
      ]
    }));
  };

  // 자격증 삭제
  const removeCertification = (index) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // 자격증 업데이트
  const updateCertification = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  // 수상 추가
  const addAward = () => {
    setProfile(prev => ({
      ...prev,
      awards: [
        ...prev.awards,
        {
          name: '',
          issuer: '',
          date: '',
          description: ''
        }
      ]
    }));
  };

  // 수상 삭제
  const removeAward = (index) => {
    setProfile(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  // 수상 업데이트
  const updateAward = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      awards: prev.awards.map((award, i) =>
        i === index ? { ...award, [field]: value } : award
      )
    }));
  };

  // 요약 업데이트
  const updateSummary = (field, value) => {
    setProfile(prev => ({
      ...prev,
      summary: { ...prev.summary, [field]: value }
    }));
  };

  // 프로필 저장
  const handleSave = async () => {
    // 간단한 필수 필드 체크
    if (!profile.basicInfo.name || !profile.basicInfo.email) {
      alert('이름과 이메일은 필수 입력 항목입니다.');
      return;
    }

    setIsSaving(true);

    try {
      // axios를 사용한 POST 요청
      const response = await axios.post('/api/profile', profile);

      // 성공 시 profileId 저장
      setSavedProfileId(response.data.profileId);
      alert('프로필이 성공적으로 저장되었습니다!');
      console.log('저장된 프로필 ID:', response.data.profileId);
      console.log('전체 응답:', response.data);

    } catch (error) {
      console.error('저장 오류:', error);

      // 에러 메시지 처리
      if (error.response) {
        // 서버가 응답을 보냈지만 에러 상태 코드
        alert(`저장 실패: ${error.response.data.message || '서버 오류'}`);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        alert('서버와 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        // 요청 설정 중 오류 발생
        alert('요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 이력서 생성
  const handleGenerateResume = async () => {
    if (!savedProfileId) {
      alert('먼저 프로필을 저장해주세요!');
      return;
    }

    setIsGenerating(true);
    setGeneratedResume(null);

    try {
      const response = await axios.post('/api/generate/basic', {
        profileId: savedProfileId
      });

      setGeneratedResume(response.data.resume);
      alert('이력서가 성공적으로 생성되었습니다!');
    } catch (error) {
      console.error('이력서 생성 오류:', error);

      if (error.response) {
        alert(`이력서 생성 실패: ${error.response.data.message || '서버 오류'}`);
      } else if (error.request) {
        alert('서버와 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // 폼 제출 (미리보기)
  const handleSubmit = (e) => {
    e.preventDefault();

    // 간단한 필수 필드 체크
    if (!profile.basicInfo.name || !profile.basicInfo.email) {
      alert('이름과 이메일은 필수 입력 항목입니다.');
      return;
    }

    console.log('프로필 데이터:', profile);
    setShowPreview(true);

    // 미리보기 영역으로 스크롤
    setTimeout(() => {
      document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">프로필 입력</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 인적사항 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">인적사항</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">이름 *</label>
              <input
                type="text"
                value={profile.basicInfo.name}
                onChange={(e) => updateBasicInfo('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="홍길동"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">이메일 *</label>
              <input
                type="email"
                value={profile.basicInfo.email}
                onChange={(e) => updateBasicInfo('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">연락처</label>
              <input
                type="tel"
                value={profile.basicInfo.phone}
                onChange={(e) => updateBasicInfo('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">거주 지역</label>
              <input
                type="text"
                value={profile.basicInfo.location}
                onChange={(e) => updateBasicInfo('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="서울시 강남구"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">개인 링크</label>
              {profile.basicInfo.links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="포트폴리오"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                + 링크 추가
              </button>
            </div>
          </div>
        </div>

        {/* 구직 방향 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">구직 방향</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">희망 직무명</label>
              <input
                type="text"
                value={profile.jobPreference.desiredPosition}
                onChange={(e) => updateJobPreference('desiredPosition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="프론트엔드 개발자"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">경력 구분</label>
              <select
                value={profile.jobPreference.careerLevel}
                onChange={(e) => updateJobPreference('careerLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="신입">신입</option>
                <option value="경력">경력</option>
                <option value="인턴·학생">인턴·학생</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">희망 근무 형태</label>
              <select
                value={profile.jobPreference.workType}
                onChange={(e) => updateJobPreference('workType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="인턴">인턴</option>
                <option value="파트타임">파트타임</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">희망 산업/업종</label>
              <input
                type="text"
                value={profile.jobPreference.industry}
                onChange={(e) => updateJobPreference('industry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="IT, 교육, 금융 등"
              />
            </div>
          </div>
        </div>

        {/* 학력 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">학력</h3>

          {profile.education.map((edu, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">학력 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  이 학력 삭제
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="학교명"
                />
                <input
                  type="text"
                  value={edu.major}
                  onChange={(e) => updateEducation(index, 'major', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="전공/학과"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="학위 (학사, 석사 등)"
                />
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => updateEducation(index, 'period', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="기간 (예: 2020.03 ~ 2024.02)"
                />
                <textarea
                  value={edu.activities}
                  onChange={(e) => updateEducation(index, 'activities', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="주요 활동/성과 (선택)"
                  rows="3"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEducation}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            + 학력 추가
          </button>
        </div>

        {/* 경력 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">경력</h3>

          {profile.experience.map((exp, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">경력 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  이 경력 삭제
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="회사/기관명"
                />
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="직무/직책명"
                />
                <input
                  type="text"
                  value={exp.workType}
                  onChange={(e) => updateExperience(index, 'workType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="근무 형태 (정규직, 계약직, 인턴 등)"
                />
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => updateExperience(index, 'period', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="기간 (예: 2022.01 ~ 2024.06)"
                />
                <textarea
                  value={exp.duties}
                  onChange={(e) => updateExperience(index, 'duties', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="주요 업무 내용"
                  rows="4"
                />
                <textarea
                  value={exp.achievements}
                  onChange={(e) => updateExperience(index, 'achievements', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="성과/실적 (선택)"
                  rows="3"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            + 경력 추가
          </button>
        </div>

        {/* 프로젝트·활동 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">프로젝트·활동</h3>

          {profile.projects.map((proj, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">프로젝트 {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="프로젝트/활동 이름"
                />
                <input
                  type="text"
                  value={proj.organization}
                  onChange={(e) => updateProject(index, 'organization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="소속/기관 (선택)"
                />
                <input
                  type="text"
                  value={proj.period}
                  onChange={(e) => updateProject(index, 'period', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="기간"
                />
                <input
                  type="text"
                  value={proj.role}
                  onChange={(e) => updateProject(index, 'role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="역할"
                />
                <textarea
                  value={proj.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="활동 내용"
                  rows="4"
                />
                <textarea
                  value={proj.result}
                  onChange={(e) => updateProject(index, 'result', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="결과/성과 (선택)"
                  rows="2"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addProject}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            + 프로젝트/활동 추가
          </button>
        </div>

        {/* 역량/스킬 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">역량/스킬</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">직무 관련 스킬</label>
              <textarea
                value={profile.skills.jobSkills}
                onChange={(e) => updateSkills('jobSkills', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="마케팅 기획, 고객 상담, 데이터 분석 등"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">도구/소프트웨어</label>
              <textarea
                value={profile.skills.tools}
                onChange={(e) => updateSkills('tools', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Excel, Photoshop, CRM, CAD 등"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">언어 능력</label>
              <textarea
                value={profile.skills.languages}
                onChange={(e) => updateSkills('languages', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="영어 B2, JLPT N2 등"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">소프트 스킬</label>
              <textarea
                value={profile.skills.softSkills}
                onChange={(e) => updateSkills('softSkills', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="커뮤니케이션, 협업, 문제 해결 등"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* 자격증/수상 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">자격증/수상</h3>

          <div className="mb-6">
            <h4 className="font-semibold mb-3">자격증</h4>
            {profile.certifications.map((cert, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">자격증 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="자격증명"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="발행기관"
                  />
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => updateCertification(index, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="취득일"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCertification}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              + 자격증 추가
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-3">수상</h4>
            {profile.awards.map((award, index) => (
              <div key={index} className="mb-4 p-3 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">수상 {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeAward(index)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={award.name}
                    onChange={(e) => updateAward(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="상 이름"
                  />
                  <input
                    type="text"
                    value={award.issuer}
                    onChange={(e) => updateAward(index, 'issuer', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="주최 기관"
                  />
                  <input
                    type="text"
                    value={award.date}
                    onChange={(e) => updateAward(index, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="연도 또는 일자"
                  />
                  <textarea
                    value={award.description}
                    onChange={(e) => updateAward(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="간단 설명 (선택)"
                    rows="2"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addAward}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              + 수상 추가
            </button>
          </div>
        </div>

        {/* 자기소개·요약 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">자기소개·요약</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">한 줄 자기소개</label>
              <input
                type="text"
                value={profile.summary.oneLine}
                onChange={(e) => updateSummary('oneLine', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="고객 중심 마인드를 가진 주니어 영업직 지원자입니다."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">강조하고 싶은 키워드</label>
              <input
                type="text"
                value={profile.summary.keywords}
                onChange={(e) => updateSummary('keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="고객 상담, 팀워크, 책임감 (쉼표로 구분)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">주의사항 (선택)</label>
              <textarea
                value={profile.summary.notes}
                onChange={(e) => updateSummary('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이력서에 포함하고 싶지 않은 내용이나 주의사항"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            프로필 미리보기
          </button>

          {/* 저장 버튼 */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isSaving
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isSaving ? '저장 중...' : '프로필 저장하기'}
          </button>

          {/* 이력서 생성 버튼 */}
          <button
            type="button"
            onClick={handleGenerateResume}
            disabled={!savedProfileId || isGenerating}
            className={`px-8 py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              !savedProfileId || isGenerating
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isGenerating ? '이력서 생성 중...' : 'AI 이력서 생성'}
          </button>
        </div>
      </form>

      {/* 미리보기 영역 */}
      {showPreview && (
        <div id="preview" className="mt-8 bg-gray-50 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">프로필 데이터 미리보기</h3>
          <p className="text-sm text-gray-600 mb-4">
            아래 JSON 데이터가 백엔드로 전송될 예정입니다.
          </p>
          <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-xs">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}

      {/* 생성된 이력서 표시 영역 */}
      {generatedResume && (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">생성된 이력서</h3>
            <button
              onClick={() => setGeneratedResume(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ 닫기
            </button>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {generatedResume}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
