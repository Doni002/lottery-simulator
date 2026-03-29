ALTER TABLE `Session`
  ADD COLUMN `simulationRunning` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `simulationStartedAt` DATETIME(3) NULL;
