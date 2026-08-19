# Modèle métier JOBSINC

Le dossier backend ne contient actuellement ni application, ni `schema.prisma`, ni migration. Ce document décrit le contrat à implémenter lorsque le backend sera ajouté.

## Compte utilisateur unique

Un utilisateur possède un seul compte. Son statut courant est porté par `User.accountStatus` :

```prisma
enum AccountStatus {
  CANDIDATE
  EMPLOYEE
}

model User {
  id            String        @id @default(cuid())
  email         String        @unique
  accountStatus AccountStatus @default(CANDIDATE)
  applications  JobApplication[]
  employments   Employment[]
}
```

L’inscription ne doit accepter aucun champ permettant de choisir `EMPLOYEE`. Le backend initialise toujours `accountStatus` à `CANDIDATE`.

## Historique des candidatures et des emplois

Les candidatures sont conservées après le recrutement. Une relation d’emploi est ajoutée séparément :

```prisma
enum ApplicationStatus {
  SUBMITTED
  INTERVIEW
  HIRED
  REJECTED
  WITHDRAWN
}

enum EmploymentStatus {
  ACTIVE
  ENDED
  SUSPENDED
}

model JobApplication {
  id          String            @id @default(cuid())
  userId      String
  companyId   String
  jobId       String
  status      ApplicationStatus @default(SUBMITTED)
  user        User              @relation(fields: [userId], references: [id])
  company     Company           @relation(fields: [companyId], references: [id])
  employment  Employment?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@index([userId])
  @@index([companyId, jobId])
}

model Employment {
  id          String           @id @default(cuid())
  userId      String
  companyId   String
  jobId       String
  applicationId String         @unique
  position    String
  startDate   DateTime
  endDate     DateTime?
  status      EmploymentStatus @default(ACTIVE)
  user        User             @relation(fields: [userId], references: [id])
  company     Company          @relation(fields: [companyId], references: [id])
  application JobApplication   @relation(fields: [applicationId], references: [id])

  @@index([userId, status])
  @@index([companyId, status])
}

model Company {
  id           String            @id @default(cuid())
  name         String
  applications JobApplication[]
  employments  Employment[]
}
```

Les noms et champs existants devront être fusionnés avec ce modèle lorsqu’un vrai schéma sera disponible ; ce bloc n’est pas une migration exécutable en l’état.

## Transition sécurisée

La confirmation d’un recrutement doit être une transaction backend :

1. vérifier que l’entreprise est autorisée à traiter l’offre ;
2. vérifier que la candidature appartient bien à l’utilisateur et à l’offre ;
3. passer la candidature à `HIRED` ;
4. créer `Employment` avec `userId`, `companyId`, `jobId`, `position`, `startDate` et `status: ACTIVE` ;
5. passer `User.accountStatus` à `EMPLOYEE`.

Aucune route publique ne doit permettre `PATCH User.accountStatus = EMPLOYEE`. Le mobile ne doit jamais être considéré comme une autorité pour cette transition.

Les anciennes candidatures restent liées à `User`. Une fin ou une suspension d’emploi modifie uniquement `Employment.status`, ce qui permet de conserver plusieurs expériences professionnelles et de réactiver ultérieurement une expérience ou un nouveau rattachement.
