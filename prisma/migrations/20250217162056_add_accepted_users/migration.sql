-- CreateTable
CREATE TABLE "Accepted" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "Accepted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accepted_userId_groupId_key" ON "Accepted"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "Accepted" ADD CONSTRAINT "Accepted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accepted" ADD CONSTRAINT "Accepted_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
