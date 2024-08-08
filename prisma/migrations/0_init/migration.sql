BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Passing] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [player_name] NVARCHAR(max) NOT NULL,
    [completions] INT NOT NULL,
    [attempts] INT NOT NULL,
    [yards] DECIMAL(18,1) NOT NULL,
    [hurries] INT NOT NULL,
    [sacks] INT NOT NULL,
    [sack_yards] DECIMAL(18,1) NOT NULL,
    [interceptions] INT NOT NULL,
    [touchdowns] INT NOT NULL,
    CONSTRAINT [PK_Passing] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Rushing] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [player_name] NVARCHAR(max) NOT NULL,
    [position] NVARCHAR(50) NOT NULL,
    [rushes] INT NOT NULL,
    [yards] DECIMAL(18,1) NOT NULL,
    [average] DECIMAL(18,1) NOT NULL,
    [touchdowns] INT NOT NULL,
    [broken_tackles] INT NOT NULL,
    [yards_after_contact] DECIMAL(18,1) NOT NULL,
    [tackles_for_loss] INT NOT NULL,
    [fumbles] INT NOT NULL,
    [fumbles_lost] INT NOT NULL,
    [tier] NVARCHAR(max) NOT NULL,
    CONSTRAINT [PK_Rushing] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

