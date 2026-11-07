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
    <section id="register" className="relative z-10 w-full border-t border-white/10 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#D0D0D0] mb-3 block">
            {siteConfig.registration.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.registration.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0D0D0] leading-relaxed">
            {siteConfig.registration.subtitle}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-mono text-[#D0D0D0]">
            <Sparkles className="h-3.5 w-3.5 text-white shrink-0" />
            <span>{siteConfig.registration.disclaimer}</span>
          </div>
        </div>

        {/* Registration Form / Confirmation Container (Dark Charcoal #171717) */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#171717] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {submittedData ? (
            /* ================================================================
               SUBMISSION CONFIRMATION (CLIENT VALIDATION SUCCESS)
               ================================================================ */
            <div className="text-center py-6 sm:py-10 space-y-6 animate-fadeIn">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white ring-8 ring-white/5 mx-auto">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] font-bold">
                  Client Validation Succeeded
                </span>
                <h3 className="mt-1 font-sans text-2xl sm:text-3xl font-bold text-white">
                  Registration Form Validated
                </h3>
                <p className="mt-2 text-sm text-[#D0D0D0] max-w-lg mx-auto">
                  Thank you, <strong className="text-white">{submittedData.fullName}</strong>. All required fields and constraints have successfully passed frontend validation.
                </p>
              </div>

              {/* Assignment Transparency Disclaimer Box */}
              <div className="max-w-xl mx-auto rounded-2xl border border-white/20 bg-white/5 p-4 text-left">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-white shrink-0 mt-0.5" />
                  <div className="text-xs font-mono text-[#D0D0D0] leading-relaxed">
                    <strong className="text-white">Assignment Demonstration Notice:</strong> In accordance with the project guidelines, this website operates frontend-only validation with no live backend or database attached.
                  </div>
                </div>
              </div>

              {/* Submitted Summary Card */}
              <div className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-[#090909] p-5 text-left text-xs font-mono space-y-2.5 text-[#D0D0D0]">
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
                  <span className="text-white uppercase font-bold">
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
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-white transition-colors"
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
                <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] font-bold block mb-2.5">
                  Participation Mode <span className="text-[#D0D0D0]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      participationType === 'individual'
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 bg-[#090909] text-[#D0D0D0] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      value="individual"
                      {...register('participationType')}
                      className="sr-only"
                    />
                    <User className="h-4 w-4 text-white" />
                    <div>
                      <span className="font-sans text-xs sm:text-sm font-bold block">
                        Individual
                      </span>
                      <span className="text-[11px] font-mono text-[#777777]">
                        Single Participant
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      participationType === 'team'
                        ? 'border-white bg-white/10 text-white'
                        : 'border-white/10 bg-[#090909] text-[#D0D0D0] hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      value="team"
                      {...register('participationType')}
                      className="sr-only"
                    />
                    <Users className="h-4 w-4 text-white" />
                    <div>
                      <span className="font-sans text-xs sm:text-sm font-bold block">
                        Team
                      </span>
                      <span className="text-[11px] font-mono text-[#777777]">
                        2 to 4 Members
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Conditional Team Details */}
              {participationType === 'team' && (
                <div className="p-4 rounded-2xl border border-white/10 bg-[#090909] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                      Team Name <span className="text-[#D0D0D0]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Matrix Pioneers"
                      {...register('teamName')}
                      className="w-full rounded-xl border border-white/15 bg-[#171717] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    />
                    {errors.teamName && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                        <AlertCircle className="h-3 w-3" />
                        {errors.teamName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                      Team Size (2 – 4) <span className="text-[#D0D0D0]">*</span>
                    </label>
                    <select
                      {...register('teamSize', { valueAsNumber: true })}
                      className="w-full rounded-xl border border-white/15 bg-[#171717] px-4 py-2.5 text-xs sm:text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    >
                      <option value={2}>2 Members</option>
                      <option value={3}>3 Members</option>
                      <option value={4}>4 Members (Maximum)</option>
                    </select>
                    {errors.teamSize && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
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
                  <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                    Full Name <span className="text-[#D0D0D0]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    {...register('fullName')}
                    className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  {errors.fullName && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                      <AlertCircle className="h-3 w-3" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                    Email Address <span className="text-[#D0D0D0]">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@ceconline.edu"
                    {...register('email')}
                    className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  {errors.email && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & College Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                    Contact Number <span className="text-[#D0D0D0]">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...register('phone')}
                    className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  {errors.phone && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                    College / Institution <span className="text-[#D0D0D0]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="College of Engineering Chengannur"
                    {...register('college')}
                    className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  {errors.college && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                      <AlertCircle className="h-3 w-3" />
                      {errors.college.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Department & Year of Study Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                    Department / Branch <span className="text-[#D0D0D0]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science, ECE, EEE"
                    {...register('department')}
                    className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  />
                  {errors.department && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                      <AlertCircle className="h-3 w-3" />
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                    Year of Study <span className="text-[#D0D0D0]">*</span>
                  </label>
                  <select
                    {...register('yearOfStudy')}
                    className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year (Semester 1 / 2)</option>
                    <option value="2nd Year">2nd Year (Semester 3 / 4)</option>
                    <option value="3rd Year">3rd Year (Semester 5 / 6)</option>
                    <option value="4th Year">4th Year (Semester 7 / 8)</option>
                    <option value="Postgraduate">Postgraduate / Other</option>
                  </select>
                  {errors.yearOfStudy && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                      <AlertCircle className="h-3 w-3" />
                      {errors.yearOfStudy.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred Problem Domain (7 Official Domains) */}
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                  Preferred Problem Domain <span className="text-[#D0D0D0]">*</span>
                </label>
                <select
                  id="domainTrack-select"
                  {...register('domainTrack')}
                  className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                >
                  {Object.values(DOMAIN_TRACKS).map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name} ({track.code})
                    </option>
                  ))}
                </select>
                {errors.domainTrack && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                    <AlertCircle className="h-3 w-3" />
                    {errors.domainTrack.message}
                  </p>
                )}
              </div>

              {/* Brief Idea Synopsis (Optional) */}
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-[#D0D0D0] block mb-1.5">
                  Initial Idea or Challenge Thought <span className="text-[#777777] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Share any initial thoughts, problem area, or user bottleneck you are interested in exploring..."
                  {...register('synopsis')}
                  className="w-full rounded-xl border border-white/15 bg-[#090909] px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white resize-none"
                />
                {errors.synopsis && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-white">
                    <AlertCircle className="h-3 w-3" />
                    {errors.synopsis.message}
                  </p>
                )}
              </div>

              {/* Submit Button (White with Black Text, Inverts on Hover) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white text-black py-3.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider border border-white hover:bg-black hover:text-white transition-all duration-150 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
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
