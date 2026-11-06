import React, { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Users,
  User,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import {
  registrationSchema,
  type RegistrationFormData,
} from '../../lib/registrationSchema'
import { siteConfig } from '../../config/siteConfig'
import { DOMAIN_TRACKS } from '../../lib/matcherLogic'

export const RegistrationSection: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<RegistrationFormData | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      college: 'College of Engineering Chengannur',
      department: '',
      yearOfStudy: '',
      participationType: 'individual',
      teamName: '',
      teamSize: 2,
      domainTrack: 'technology',
      synopsis: '',
    },
  })

  const participationType = useWatch({
    control,
    name: 'participationType',
    defaultValue: 'individual',
  })

  const onSubmit = (data: RegistrationFormData) => {
    // Frontend-only validation per assignment requirements
    setSubmittedData(data)
  }

  const handleResetForm = () => {
    setSubmittedData(null)
    reset()
  }

  return (
    <section id="register" className="relative z-10 w-full border-t border-white/10 bg-[#241C1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#F0444D] mb-3 block">
            {siteConfig.registration.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.registration.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#C5C0C0] leading-relaxed">
            {siteConfig.registration.subtitle}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-mono text-[#C5C0C0]">
            <Sparkles className="h-3.5 w-3.5 text-[#F0444D] shrink-0" />
            <span>{siteConfig.registration.disclaimer}</span>
          </div>
        </div>

        {/* Registration Form / Confirmation Container */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#1D1617] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {submittedData ? (
            /* ================================================================
               SUBMISSION CONFIRMATION (CLIENT VALIDATION SUCCESS)
               ================================================================ */
            <div className="text-center py-6 sm:py-10 space-y-6 animate-fadeIn">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#F0444D]/20 text-[#F0444D] ring-8 ring-[#F0444D]/10 mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#F0444D] font-bold">
                  Client Validation Succeeded
                </span>
                <h3 className="mt-1 font-sans text-2xl sm:text-3xl font-bold text-white">
                  Registration Form Validated
                </h3>
                <p className="mt-2 text-sm text-[#C5C0C0] max-w-lg mx-auto">
                  Thank you, <strong className="text-white">{submittedData.fullName}</strong>. All required fields and constraints have successfully passed frontend validation.
                </p>
              </div>

              {/* Assignment Transparency Disclaimer Box */}
              <div className="max-w-xl mx-auto rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-left">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs font-mono text-amber-200 leading-relaxed">
                    <strong>Assignment Demonstration Notice:</strong> In accordance with the project guidelines, this website operates frontend-only validation with no live backend or database attached.
                  </div>
                </div>
              </div>

              {/* Submitted Summary Card */}
              <div className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-[#241C1D] p-5 text-left text-xs font-mono space-y-2.5 text-[#C5C0C0]">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Participant:</span>
                  <span className="text-white font-bold">{submittedData.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Contact:</span>
                  <span className="text-white">{submittedData.email} · {submittedData.phone}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Institution:</span>
                  <span className="text-white">{submittedData.college}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Branch & Year:</span>
                  <span className="text-white">{submittedData.department} ({submittedData.yearOfStudy})</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Participation Mode:</span>
                  <span className="text-[#F0444D] uppercase font-bold">
                    {submittedData.participationType === 'team'
                      ? `Team (${submittedData.teamName} · ${submittedData.teamSize} members)`
                      : 'Individual Participant'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Chosen Domain:</span>
                  <span className="text-white font-bold">
                    {DOMAIN_TRACKS[submittedData.domainTrack]?.name || submittedData.domainTrack}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Submit Another Registration</span>
                </button>
              </div>
            </div>
          ) : (
            /* ================================================================
               INTERACTIVE REGISTRATION FORM
               ================================================================ */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Participation Mode Toggle (Individual vs Team) */}
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] font-bold block mb-2.5">
                  Participation Mode <span className="text-[#F0444D]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      participationType === 'individual'
                        ? 'border-[#F0444D] bg-[#F0444D]/10 text-white'
                        : 'border-white/10 bg-[#241C1D] text-[#C5C0C0] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      value="individual"
                      {...register('participationType')}
                      className="sr-only"
                    />
                    <User className="h-4 w-4 text-[#F0444D]" />
                    <div>
                      <span className="font-sans text-xs sm:text-sm font-bold block">
                        Individual
                      </span>
                      <span className="text-[11px] font-mono text-[#8e8989]">
                        Single Participant
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      participationType === 'team'
                        ? 'border-[#F0444D] bg-[#F0444D]/10 text-white'
                        : 'border-white/10 bg-[#241C1D] text-[#C5C0C0] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      value="team"
                      {...register('participationType')}
                      className="sr-only"
                    />
                    <Users className="h-4 w-4 text-[#F0444D]" />
                    <div>
                      <span className="font-sans text-xs sm:text-sm font-bold block">
                        Team
                      </span>
                      <span className="text-[11px] font-mono text-[#8e8989]">
                        2 to 4 Members
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Team Details */}
              {participationType === 'team' && (
                <div className="p-4 rounded-2xl border border-white/10 bg-[#241C1D] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                      Team Name <span className="text-[#F0444D]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Matrix Pioneers"
                      {...register('teamName')}
                      className="w-full rounded-xl border border-white/15 bg-[#1D1617] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                    />
                    {errors.teamName && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                        <AlertCircle className="h-3 w-3" />
                        {errors.teamName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                      Team Size (2 – 4) <span className="text-[#F0444D]">*</span>
                    </label>
                    <select
                      {...register('teamSize', { valueAsNumber: true })}
                      className="w-full rounded-xl border border-white/15 bg-[#1D1617] px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                    >
                      <option value={2}>2 Members</option>
                      <option value={3}>3 Members</option>
                      <option value={4}>4 Members (Maximum)</option>
                    </select>
                    {errors.teamSize && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                        <AlertCircle className="h-3 w-3" />
                        {errors.teamSize.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Personal Details Row: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                    Full Name <span className="text-[#F0444D]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    {...register('fullName')}
                    className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                  />
                  {errors.fullName && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                    Email Address <span className="text-[#F0444D]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@ceconline.edu"
                    {...register('email')}
                    className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                  />
                  {errors.email && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & College Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                    Contact Number <span className="text-[#F0444D]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register('phone')}
                    className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                  />
                  {errors.phone && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                    College / Institution <span className="text-[#F0444D]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="College of Engineering Chengannur"
                    {...register('college')}
                    className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                  />
                  {errors.college && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.college.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Department & Year of Study Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                    Department / Branch <span className="text-[#F0444D]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science, ECE, EEE"
                    {...register('department')}
                    className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                  />
                  {errors.department && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                    Year of Study <span className="text-[#F0444D]">*</span>
                  </label>
                  <select
                    {...register('yearOfStudy')}
                    className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year (Semester 1 / 2)</option>
                    <option value="2nd Year">2nd Year (Semester 3 / 4)</option>
                    <option value="3rd Year">3rd Year (Semester 5 / 6)</option>
                    <option value="4th Year">4th Year (Semester 7 / 8)</option>
                    <option value="Postgraduate">Postgraduate / Other</option>
                  </select>
                  {errors.yearOfStudy && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.yearOfStudy.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred Problem Domain (7 Official Domains) */}
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                  Preferred Problem Domain <span className="text-[#F0444D]">*</span>
                </label>
                <select
                  id="domainTrack-select"
                  {...register('domainTrack')}
                  className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D]"
                >
                  {Object.values(DOMAIN_TRACKS).map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name} ({track.code})
                    </option>
                  ))}
                </select>
                {errors.domainTrack && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                    <AlertCircle className="h-3 w-3" />
                    {errors.domainTrack.message}
                  </p>
                )}
              </div>

              {/* Brief Idea Synopsis (Optional) */}
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] block mb-1.5">
                  Initial Idea or Challenge Thought <span className="text-[#8e8989] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share any initial thoughts, problem area, or user bottleneck you are interested in exploring..."
                  {...register('synopsis')}
                  className="w-full rounded-xl border border-white/15 bg-[#241C1D] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#F0444D] focus:outline-none focus:ring-1 focus:ring-[#F0444D] resize-none"
                />
                {errors.synopsis && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-[#F0444D]">
                    <AlertCircle className="h-3 w-3" />
                    {errors.synopsis.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F0444D] py-3.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#F0444D]/25 transition-all duration-150 hover:bg-[#C92E39] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Sprint Registration</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default RegistrationSection
