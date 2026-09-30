"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { Sparkles, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";
import { StaggeredContainer, StaggeredItem } from "./AnimatedEntry";

interface ProfileCardProps {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
  isMember?: boolean;
  membershipTier?: string;
  memberSince?: string;
  isEditing?: boolean;
  orderCount?: number;
  isLoadingStats?: boolean;
  onAvatarUpload: (avatarUrl: string) => Promise<void>;
  onAvatarError: (error: string) => void;
}

export function ProfileCard({
  avatarUrl,
  firstName,
  lastName,
  email,
  isMember = false,
  membershipTier,
  memberSince,
  isEditing = false,
  orderCount = 0,
  isLoadingStats = false,
  onAvatarUpload,
  onAvatarError,
}: ProfileCardProps) {
  const displayName =
    firstName || lastName
      ? `${firstName || ""} ${lastName || ""}`.trim()
      : email?.split("@")[0] || "Usuario";

  return (
    <Card variant="brand-subtle" className="shadow-alkimya overflow-hidden">
      <CardContent className="p-4 sm:p-5 bg-bg-light">
        <StaggeredContainer
          className="text-center space-y-3"
          staggerDelay={0.1}
        >
          {/* Avatar with Upload */}
          <StaggeredItem>
            <div className="flex justify-center">
              <AvatarUpload
                currentAvatarUrl={avatarUrl || undefined}
                onUploadSuccess={onAvatarUpload}
                onUploadError={onAvatarError}
                isEditing={isEditing}
                size="md"
              />
            </div>
          </StaggeredItem>

          {/* User Info */}
          <StaggeredItem>
            <div>
              <h3 className="text-xl font-normal text-[#051341]" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {displayName}
              </h3>
              <p className="text-sm text-text-primary/70 font-text mt-1">
                {email}
              </p>
            </div>
          </StaggeredItem>

          {/* Badges */}
          <StaggeredItem>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className="bg-[#16345F] text-[#FFF2E9] font-text">
                <Heart className="h-3 w-3 mr-1" />
                Cliente Activo
              </Badge>
              {isMember && (
                <Badge className="border border-[#005080] bg-[#005080]/10 text-[#051341] font-text">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Miembro
                </Badge>
              )}
              <Badge
                variant="outline"
                className="border-[#16345F]/20 text-[#16345F]/70 font-text"
              >
                <Award className="h-3 w-3 mr-1" />
                Desde {memberSince}
              </Badge>
            </div>
          </StaggeredItem>

          {/* Quick Stats */}
          <StaggeredItem>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-primary/20">
              <div className="text-center">
                {isLoadingStats ? (
                  <motion.div
                    className="h-8 w-8 mx-auto bg-brand-primary/10 rounded animate-pulse"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ) : (
                  <motion.p
                    className="text-2xl font-bold text-[#005080]"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {orderCount}
                  </motion.p>
                )}
                <p className="text-xs text-text-primary/70 font-text">
                  Pedidos
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#005080]">
                  {membershipTier && membershipTier !== "none" ? "1" : "0"}
                </p>
                <p className="text-xs text-text-primary/70 font-text">
                  Membresías
                </p>
              </div>
            </div>
          </StaggeredItem>
        </StaggeredContainer>
      </CardContent>
    </Card>
  );
}
