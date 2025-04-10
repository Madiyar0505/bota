"use client"

import { HTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"

interface AnimatedCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className = '', variant = 'default', ...props }, ref) => {
    const baseStyles = "rounded-xl overflow-hidden transition-all duration-300"
    
    const variantStyles = {
      default: "bg-card text-card-foreground shadow-lg hover:shadow-xl",
      glass: "bg-card/10 backdrop-blur-lg border border-border",
      gradient: "bg-gradient-to-br from-primary/10 to-primary/20"
    }

    return (
      <motion.div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard" 