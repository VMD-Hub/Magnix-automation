-- Phase 3 Agent: service catalog, entitlements, quizzes
CREATE TYPE "AgentServiceCategory" AS ENUM ('TRAINING', 'LEGAL', 'PRODUCT');
CREATE TYPE "AgentEntitlementStatus" AS ENUM ('LOCKED', 'ACTIVE', 'EXPIRED', 'REVOKED');
CREATE TYPE "QuizAttemptStatus" AS ENUM ('IN_PROGRESS', 'PASSED', 'FAILED');

CREATE TABLE "agent_services" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "AgentServiceCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content_markdown" TEXT,
    "is_required_for_ctv" BOOLEAN NOT NULL DEFAULT false,
    "requires_code" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_services_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "agent_services_code_key" ON "agent_services"("code");
CREATE INDEX "agent_services_category_sort_order_idx" ON "agent_services"("category", "sort_order");

CREATE TABLE "agent_entitlements" (
    "id" TEXT NOT NULL,
    "broker_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "status" "AgentEntitlementStatus" NOT NULL DEFAULT 'LOCKED',
    "source" TEXT NOT NULL DEFAULT 'locked',
    "activated_at" TIMESTAMP(3),
    "training_completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_entitlements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "agent_entitlements_broker_id_service_id_key" ON "agent_entitlements"("broker_id", "service_id");
CREATE INDEX "agent_entitlements_broker_id_status_idx" ON "agent_entitlements"("broker_id", "status");

CREATE TABLE "agent_quizzes" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pass_score" INTEGER NOT NULL DEFAULT 70,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_quizzes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "agent_quizzes_service_id_key" ON "agent_quizzes"("service_id");

CREATE TABLE "agent_quiz_questions" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "options_json" JSONB NOT NULL,
    "correct_option" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "agent_quiz_questions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "agent_quiz_questions_quiz_id_sort_order_idx" ON "agent_quiz_questions"("quiz_id", "sort_order");

CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "broker_id" TEXT NOT NULL,
    "status" "QuizAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "score" INTEGER,
    "answers_json" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "quiz_attempts_broker_id_quiz_id_idx" ON "quiz_attempts"("broker_id", "quiz_id");

ALTER TABLE "agent_entitlements" ADD CONSTRAINT "agent_entitlements_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_entitlements" ADD CONSTRAINT "agent_entitlements_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "agent_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_quizzes" ADD CONSTRAINT "agent_quizzes_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "agent_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "agent_quiz_questions" ADD CONSTRAINT "agent_quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "agent_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "agent_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "brokers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
