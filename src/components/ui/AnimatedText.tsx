import React from 'react'
import { motion, type Variants } from 'motion/react'
import { useReducedMotion } from '../../animations/useReducedMotion'
import { cn } from '../../lib/utils'

export interface AnimatedTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  type?: 'words' | 'fade-up'
  delay?: number
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: customDelay,
    },
  }),
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: 'easeOut',
    },
  },
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  as: Component = 'h2',
  type = 'words',
  delay = 0,
}) => {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <Component className={className}>{text}</Component>
  }

  if (type === 'fade-up') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        className={className}
      >
        <Component className="contents">{text}</Component>
      </motion.div>
    )
  }

  // Word-by-word reveal
  const words = text.split(' ')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
      className={cn('inline-flex flex-wrap gap-x-2', className)}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={childVariants}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default AnimatedText
