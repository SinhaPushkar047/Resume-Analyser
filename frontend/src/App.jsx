
import { useState } from 'react'

const tabs = [
  'Overview',
  'Skills & Gaps',
  'Career Roadmap',
  'Resume Review',
  'Projects',
]

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      )}
    </div>
  )
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-slate-900/80 p-5 shadow-lg shadow-black/10 ${className}`}
    >
      {children}
    </div>
  )
}

function Tag({ children, color = 'slate' }) {
  const colors = {
    slate: 'border-slate-700 bg-slate-800 text-slate-300',
    green: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    blue: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    purple: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    red: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
  }

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-medium ${colors[color] || colors.slate}`}
    >
      {children}
    </span>
  )
}

function BulletList({ items, color = 'indigo' }) {
  if (!items?.length) {
    return <p className="text-sm text-slate-500">No information provided.</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-300">
          <span
            className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
              color === 'green'
                ? 'bg-emerald-400'
                : color === 'amber'
                  ? 'bg-amber-400'
                  : color === 'red'
                    ? 'bg-rose-400'
                    : 'bg-indigo-400'
            }`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function App() {
  const [targetRole, setTargetRole] = useState('')
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('Overview')

  const handleAnalyze = async () => {
    if (!resume || !targetRole.trim()) return

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', resume)
      formData.append('target_role', targetRole.trim())

      const response = await fetch(
        'http://127.0.0.1:8000/analyze-resume',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : JSON.stringify(data.detail)
        )
      }

      setResults(data)
      setActiveTab('Overview')
    } catch (err) {
      setError(err.message || 'Could not connect to FastAPI.')
    } finally {
      setLoading(false)
    }
  }

  const profile = results?.profile
  const analysis = results?.analysis
  const assessment = analysis?.target_role_assessment
  const resumeScore = analysis?.resume_score

  const skills = profile?.skills || []
  const projects = profile?.project || []
  const experience = profile?.exp

  const readiness = assessment?.readiness_level || 'Not assessed'
  const readinessLower = readiness.toLowerCase()

  const readinessColor =
    readinessLower.includes('strong')
      ? 'green'
      : readinessLower.includes('partial')
        ? 'amber'
        : readinessLower.includes('significant')
          ? 'red'
          : 'slate'

  const clearResults = () => {
    setResume(null)
    setTargetRole('')
    setResults(null)
    setError('')
    setActiveTab('Overview')
  }

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#080b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <button
            type="button"
            onClick={clearResults}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-black shadow-lg shadow-indigo-500/20">
              RA
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">
                Resume<span className="text-indigo-400">AI</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Career intelligence
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            AI analysis workspace
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        {/* Hero and upload */}
        <section className="mb-10 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Tag color="purple">AI-POWERED CAREER ANALYSIS</Tag>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Turn your resume into a{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                career strategy.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
              Understand your strengths, uncover skill gaps, and discover
              practical next steps for your target role.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Tag>Resume extraction</Tag>
              <Tag>Skill gap analysis</Tag>
              <Tag>Personalised roadmap</Tag>
            </div>
          </div>

          <Card className="border-indigo-400/20 bg-gradient-to-br from-slate-900 to-indigo-950/30">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">Analyse your resume</p>
                <p className="mt-1 text-sm text-slate-400">
                  Upload a PDF to get started
                </p>
              </div>
              <span className="text-2xl">✦</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAnalyze()
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="targetRole" className="mb-2 block text-sm font-medium text-slate-300">
                  Target job role
                </label>
                <input
                  id="targetRole"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. AI Engineer"
                  className="w-full rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label htmlFor="resumeFile" className="mb-2 block text-sm font-medium text-slate-300">
                  Resume PDF
                </label>
                <label
                  htmlFor="resumeFile"
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-600 bg-black/20 p-4 transition hover:border-indigo-400 hover:bg-indigo-500/5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-xl">
                    📄
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {resume ? resume.name : 'Choose your resume'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {resume
                        ? `${(resume.size / 1024).toFixed(0)} KB · PDF selected`
                        : 'PDF document'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-300">
                    Browse
                  </span>
                  <input
                    id="resumeFile"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      setError('')
                      setResults(null)

                      if (!file) {
                        setResume(null)
                        return
                      }

                      if (
                        file.type !== 'application/pdf' &&
                        !file.name.toLowerCase().endsWith('.pdf')
                      ) {
                        setError('Please select a PDF file.')
                        setResume(null)
                        e.target.value = ''
                        return
                      }

                      setResume(file)
                    }}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={!resume || !targetRole.trim() || loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold shadow-lg shadow-indigo-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analysing with AI...
                  </>
                ) : (
                  <>Analyse My Resume <span>→</span></>
                )}
              </button>

              {loading && (
                <p className="text-center text-xs leading-5 text-slate-400">
                  Your resume is being processed. This may take a little while.
                </p>
              )}

              {error && (
                <div role="alert" className="break-words rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">
                  {error}
                </div>
              )}
            </form>
          </Card>
        </section>

        {/* Dashboard */}
        {results && (
          <section className="space-y-6">
            {/* Candidate header */}
            <div className="flex flex-col justify-between gap-5 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 md:flex-row md:items-center md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-black">
                  {(profile?.candidate_name || 'C').trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Candidate report
                  </p>
                  <h2 className="mt-1 text-2xl font-bold md:text-3xl">
                    {profile?.candidate_name || 'Candidate'}
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    {profile?.degree || 'Degree not provided'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {profile?.college || 'College not provided'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-xs text-slate-500">Target role</p>
                  <p className="mt-1 font-semibold text-indigo-300">{targetRole}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const report = JSON.stringify(results, null, 2)
                    const blob = new Blob([report], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = 'resume-analysis.json'
                    link.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5"
                >
                  ↓ Export JSON
                </button>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <p className="text-sm text-slate-400">CGPA</p>
                <p className="mt-3 text-3xl font-black text-white">
                  {profile?.cgpa ?? '—'}
                </p>
                <p className="mt-2 text-xs text-slate-500">Extracted from resume</p>
              </Card>

              <Card>
                <p className="text-sm text-slate-400">Skills identified</p>
                <p className="mt-3 text-3xl font-black text-sky-300">{skills.length}</p>
                <p className="mt-2 text-xs text-slate-500">Skills listed in your profile</p>
              </Card>

              <Card>
                <p className="text-sm text-slate-400">Projects identified</p>
                <p className="mt-3 text-3xl font-black text-violet-300">{projects.length}</p>
                <p className="mt-2 text-xs text-slate-500">Projects extracted from resume</p>
              </Card>

              <Card>
                <p className="text-sm text-slate-400">Experience</p>
                <p className="mt-3 text-3xl font-black text-emerald-300">
                  {experience == null ? '—' : `${experience} yrs`}
                </p>
                <p className="mt-2 text-xs text-slate-500">As extracted by the model</p>
              </Card>
            </div>

            {/* Readiness summary */}
            <Card className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Target role assessment
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  {assessment?.job_role || targetRole}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  {assessment
                    ? 'Review the strengths, missing skills, and recommendations identified by the career analysis.'
                    : 'No target-role assessment was returned by the model.'}
                </p>
              </div>
              <div className="shrink-0">
                <Tag color={readinessColor}>{readiness}</Tag>
              </div>
            </Card>

            
            {/* Resume Quality Score */}
            <Card className="overflow-hidden border-indigo-400/20 bg-gradient-to-br from-indigo-950/40 to-slate-900">
              <SectionTitle
                eyebrow="Resume quality"
                title="Your Resume Score"
                description="An assessment of the resume content based on the information extracted."
              />

              {resumeScore ? (
                <div className="grid gap-8 md:grid-cols-[220px_1fr]">
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-6">
                    <div className="text-6xl font-black tracking-tight text-indigo-300">
                      {Number(resumeScore.overall_score).toFixed(1)}
                      <span className="text-2xl text-slate-500">/10</span>
                    </div>

                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, Number(resumeScore.overall_score) * 10)
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-center text-xs text-slate-400">
                      AI-assessed resume quality
                    </p>
                  </div>

                  <div className="space-y-5">
                    {[
                      ['Content quality', resumeScore.content_quality],
                      ['Project quality', resumeScore.project_quality],
                      ['Skills presentation', resumeScore.skills_presentation],
                      ['Achievement evidence', resumeScore.achievement_evidence],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-sm text-slate-300">{label}</span>
                          <span className="text-sm font-bold text-white">
                            {Number(value).toFixed(1)}/10
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-400"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, Number(value) * 10)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                      <h3 className="mb-4 font-bold text-emerald-300">
                        What works well
                      </h3>
                      <BulletList items={resumeScore.strengths} color="green" />
                    </div>

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                      <h3 className="mb-4 font-bold text-amber-300">
                        How to improve
                      </h3>
                      <BulletList items={resumeScore.improvements} color="amber" />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No resume score was returned. Check that the backend schema and
                  career-analysis prompt include resume_score.
                </p>
              )}
            </Card>


            {/* Tabs */}
            <div className="overflow-x-auto border-b border-white/10">
              <div className="flex min-w-max gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
                      activeTab === tab
                        ? 'border-indigo-400 text-indigo-300'
                        : 'border-transparent text-slate-500 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview tab */}
            {activeTab === 'Overview' && (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <SectionTitle
                    eyebrow="Candidate profile"
                    title="Professional snapshot"
                    description="Information extracted from your resume."
                  />
                  <div className="space-y-4">
                    {[
                      ['Full name', profile?.candidate_name],
                      ['Email', profile?.email],
                      ['Degree', profile?.degree],
                      ['College', profile?.college],
                      ['CGPA', profile?.cgpa],
                      ['Experience', experience == null ? null : `${experience} years`],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex flex-col justify-between gap-1 border-b border-white/[0.06] pb-3 sm:flex-row sm:gap-4"
                      >
                        <span className="text-sm text-slate-500">{label}</span>
                        <span className="break-words text-sm font-medium text-slate-200 sm:max-w-[65%] sm:text-right">
                          {value == null || value === '' ? 'Not provided' : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionTitle
                    eyebrow="Extracted capabilities"
                    title="Skills at a glance"
                    description={`${skills.length} skills identified by the resume extraction model.`}
                  />
                  <div className="flex flex-wrap gap-2">
                    {skills.length ? (
                      skills.map((skill, index) => (
                        <Tag key={`${skill}-${index}`} color="blue">{skill}</Tag>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No skills were returned.</p>
                    )}
                  </div>
                </Card>

                <Card>
                  <SectionTitle
                    eyebrow="What stands out"
                    title="Your strengths"
                  />
                  <BulletList items={assessment?.strengths} color="green" />
                </Card>

                <Card>
                  <SectionTitle
                    eyebrow="Recommended direction"
                    title="Priority actions"
                  />
                  <BulletList items={assessment?.recommendations} color="amber" />
                </Card>

                <Card className="lg:col-span-2">
                  <SectionTitle
                    eyebrow="Additional career options"
                    title="Alternative job roles"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    {(analysis?.alternative_job_roles || []).map((role, index) => (
                      <div key={`${role.role}-${index}`} className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                        <h3 className="font-bold text-white">{role.role}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{role.reason}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(role.relevant_existing_skills || []).map((skill, i) => (
                            <Tag key={`${skill}-${i}`} color="green">{skill}</Tag>
                          ))}
                        </div>
                      </div>
                    ))}
                    {!analysis?.alternative_job_roles?.length && (
                      <p className="text-sm text-slate-500">No alternative roles returned.</p>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Skills and gaps tab */}
            {activeTab === 'Skills & Gaps' && (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <SectionTitle
                    eyebrow="Current profile"
                    title="Skills identified"
                  />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Tag key={`${skill}-${index}`} color="green">{skill}</Tag>
                    ))}
                    {!skills.length && <p className="text-sm text-slate-500">No skills found.</p>}
                  </div>
                </Card>

                <Card>
                  <SectionTitle
                    eyebrow="Areas to strengthen"
                    title="Missing or unproven skills"
                    description="Skills the model believes need more evidence or development for your target role."
                  />
                  <BulletList items={assessment?.missing_or_unproven_skills} color="amber" />
                </Card>

                <Card>
                  <SectionTitle
                    eyebrow="Experience alignment"
                    title="Experience gaps"
                  />
                  <BulletList items={assessment?.experience_gaps} color="red" />
                </Card>

                <Card>
                  <SectionTitle
                    eyebrow="Build your profile"
                    title="Additional skills to learn"
                  />
                  <div className="space-y-4">
                    {(analysis?.additional_skills || []).map((item, index) => (
                      <div key={`${item.skill}-${index}`} className="border-b border-white/[0.06] pb-4 last:border-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold">{item.skill}</h3>
                          <Tag color={
                            item.importance?.toLowerCase() === 'high'
                              ? 'red'
                              : item.importance?.toLowerCase() === 'medium'
                                ? 'amber'
                                : 'slate'
                          }>
                            {item.importance || 'Priority not specified'}
                          </Tag>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.reason}</p>
                      </div>
                    ))}
                    {!analysis?.additional_skills?.length && (
                      <p className="text-sm text-slate-500">No additional skill recommendations returned.</p>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Roadmap tab */}
            {activeTab === 'Career Roadmap' && (
              <Card>
                <SectionTitle
                  eyebrow="Your next steps"
                  title="Personalised learning roadmap"
                  description="Follow the phases returned by the career analysis."
                />

                <div className="space-y-0">
                  {(analysis?.learning_roadmap || []).map((step, index) => (
                    <div key={`${step.phase}-${index}`} className="relative flex gap-5 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 font-bold text-indigo-300">
                          {index + 1}
                        </div>
                        {index < analysis.learning_roadmap.length - 1 && (
                          <div className="mt-2 min-h-8 w-px flex-1 bg-gradient-to-b from-indigo-500/60 to-slate-700" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-black/20 p-5">
                        <h3 className="text-lg font-bold">{step.phase}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{step.expected_outcome}</p>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                          <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-300">
                              Topics to learn
                            </p>
                            <BulletList items={step.topics_to_learn} />
                          </div>
                          <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-300">
                              Practical tasks
                            </p>
                            <BulletList items={step.practical_tasks} color="green" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!analysis?.learning_roadmap?.length && (
                    <p className="text-sm text-slate-500">No roadmap was returned.</p>
                  )}
                </div>
              </Card>
            )}

            {/* Resume review tab */}
            {activeTab === 'Resume Review' && (
              <div className="space-y-5">
                <Card>
                  <SectionTitle
                    eyebrow="Actionable feedback"
                    title="Improve your resume"
                    description="Use these suggestions to improve clarity, evidence, and relevance."
                  />

                  <div className="space-y-4">
                    {(analysis?.resume_improvements || []).map((item, index) => (
                      <div key={`${item.section}-${index}`} className="rounded-xl border border-white/[0.08] bg-black/20 p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-bold">{item.section}</h3>
                          <Tag color="purple">Suggestion {index + 1}</Tag>
                        </div>
                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-amber-300">
                          Issue
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.issue}</p>
                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Recommendation
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.recommendation}</p>
                        {item.example && (
                          <div className="mt-4 rounded-lg border border-indigo-400/20 bg-indigo-500/5 p-4">
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                              Example
                            </p>
                            <p className="text-sm leading-6 text-slate-300">{item.example}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {!analysis?.resume_improvements?.length && (
                      <p className="text-sm text-slate-500">No resume improvements returned.</p>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Project recommendations tab */}
            {activeTab === 'Projects' && (
              <div className="space-y-6">
                <Card>
                  <SectionTitle
                    eyebrow="Extracted experience"
                    title="Projects already on your resume"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    {projects.map((project, index) => (
                      <div key={`${project}-${index}`} className="flex gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm">
                          {index + 1}
                        </span>
                        <p className="text-sm leading-6 text-slate-300">{project}</p>
                      </div>
                    ))}
                    {!projects.length && (
                      <p className="text-sm text-slate-500">No projects were extracted.</p>
                    )}
                  </div>
                </Card>

                <Card>
                  <SectionTitle
                    eyebrow="Portfolio development"
                    title="Recommended projects"
                    description="Projects suggested to demonstrate skills relevant to your target role."
                  />
                  <div className="grid gap-4 lg:grid-cols-2">
                    {(analysis?.project_recommendations || []).map((project, index) => (
                      <div key={`${project.project_name}-${index}`} className="rounded-xl border border-white/[0.08] bg-black/20 p-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-lg text-violet-300">
                          {index + 1}
                        </div>
                        <h3 className="mt-4 text-lg font-bold">{project.project_name}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{project.objective}</p>

                        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-indigo-300">
                          Skills demonstrated
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(project.skills_demonstrated || []).map((skill, i) => (
                            <Tag key={`${skill}-${i}`} color="blue">{skill}</Tag>
                          ))}
                        </div>

                        <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Key features
                        </p>
                        <BulletList items={project.key_features} color="green" />
                      </div>
                    ))}
                    {!analysis?.project_recommendations?.length && (
                      <p className="text-sm text-slate-500">No project recommendations returned.</p>
                    )}
                  </div>
                </Card>
              </div>
            )}

            <div className="flex flex-col justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs text-slate-500 sm:flex-row">
              <p>ResumeAI · AI-generated career guidance</p>
              <button
                type="button"
                onClick={clearResults}
                className="self-start font-semibold text-indigo-300 hover:text-indigo-200"
              >
                ← Analyse another resume
              </button>
            </div>
          </section>
        )}

        {!results && (
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: '⌕',
                title: 'Understand your profile',
                text: 'Extract your education, experience, skills, and projects.',
              },
              {
                icon: '◇',
                title: 'Find skill gaps',
                text: 'Compare your current profile with your target role.',
              },
              {
                icon: '↗',
                title: 'Plan your next move',
                text: 'Get learning phases, project ideas, and improvements.',
              },
            ].map((item) => (
              <Card key={item.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-300">
                  {item.icon}
                </div>
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
              </Card>
            ))}
          </section>
        )}

        <footer className="mt-12 border-t border-white/[0.06] pt-6 text-center text-xs leading-6 text-slate-600">
          AI recommendations are guidance, not guarantees of employment. Verify extracted details and tailor your resume to each role.
        </footer>
      </main>
    </div>
  )
}

export default App
