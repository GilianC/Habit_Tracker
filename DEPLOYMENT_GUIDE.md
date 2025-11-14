# 🚀 Guide de Déploiement Vercel - Habit Tracker

Ce guide vous explique comment déployer votre application Habit Tracker sur Vercel.

## 📋 Prérequis

- ✅ Compte GitHub avec votre repository
- ✅ Base de données PostgreSQL (Neon) configurée
- ✅ Variables d'environnement préparées

---

## 🔧 Étape 1 : Préparer le projet

### 1.1 Vérifier le .gitignore
Assurez-vous que `.env` est bien dans le `.gitignore` pour ne pas exposer vos secrets.

### 1.2 Commit et push vos changements
```bash
git add .
git commit -m "feat: configuration Prisma et nouvelle DA rose"
git push origin main
```

### 1.3 Tester le build localement
```bash
pnpm build
```

Si le build réussit, vous êtes prêt pour Vercel !

---

## 🌐 Étape 2 : Créer un compte Vercel

1. Allez sur **https://vercel.com**
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories GitHub

---

## 📦 Étape 3 : Importer votre projet

1. Une fois connecté, cliquez sur **"Add New..."** puis **"Project"**
2. Trouvez votre repository **"Habit_Tracker"** dans la liste
3. Cliquez sur **"Import"**

---

## ⚙️ Étape 4 : Configurer les variables d'environnement

**IMPORTANT** : Avant de déployer, ajoutez vos variables d'environnement :

### Variables à ajouter dans Vercel :

```env
# Base de données PostgreSQL (Neon)
POSTGRES_URL=postgresql://neondb_owner:npg_obuhPXi81eEa@ep-weathered-scene-ag1fhctj-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_obuhPXi81eEa@ep-weathered-scene-ag1fhctj-pooler.c-2.eu-central-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_obuhPXi81eEa@ep-weathered-scene-ag1fhctj.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require

# NextAuth.js (GÉNÉREZ UN NOUVEAU SECRET!)
AUTH_SECRET=votre-secret-genere-avec-openssl
AUTH_URL=https://votre-app.vercel.app/api/auth
```

### Comment générer AUTH_SECRET :
```bash
# Sur Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Ou sur Linux/Mac
openssl rand -base64 32
```

### Dans l'interface Vercel :
1. Dans la section **"Environment Variables"**
2. Ajoutez chaque variable une par une :
   - Name: `POSTGRES_PRISMA_URL`
   - Value: `votre-url-postgres`
   - Environnement: ✅ Production, ✅ Preview, ✅ Development
3. Cliquez sur **"Add"**
4. Répétez pour toutes les variables

---

## 🚀 Étape 5 : Déployer

1. Une fois les variables configurées, cliquez sur **"Deploy"**
2. Vercel va :
   - ✅ Cloner votre repository
   - ✅ Installer les dépendances (`pnpm install`)
   - ✅ Générer le client Prisma (`prisma generate`)
   - ✅ Build l'application (`next build`)
   - ✅ Déployer sur leur infrastructure

3. Attendez quelques minutes (généralement 2-3 minutes)

---

## ✅ Étape 6 : Vérifications post-déploiement

### 6.1 Initialiser la base de données en production

**Option 1 : Depuis votre terminal local**
```bash
# Mettre à jour .env avec POSTGRES_PRISMA_URL de production
pnpm prisma db push
pnpm prisma:seed
```

**Option 2 : Depuis Vercel CLI**
```bash
# Installer Vercel CLI
pnpm add -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Exécuter les commandes
vercel env pull .env.production
pnpm prisma db push
pnpm prisma:seed
```

### 6.2 Tester votre application

1. Cliquez sur le lien de votre déploiement (ex: `https://habit-tracker-xxx.vercel.app`)
2. Vérifiez que :
   - ✅ La landing page s'affiche correctement
   - ✅ Vous pouvez vous inscrire
   - ✅ Vous pouvez vous connecter
   - ✅ Le dashboard s'affiche
   - ✅ Les données se chargent

---

## 🔄 Déploiements automatiques

À partir de maintenant, **chaque push sur `main` déclenchera un déploiement automatique** !

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
# ✨ Vercel déploie automatiquement !
```

---

## 🐛 Résolution de problèmes

### Erreur : "Prisma Client not generated"
```bash
# Ajoutez un script postinstall dans package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Erreur : "DATABASE_URL is not defined"
- Vérifiez que `POSTGRES_PRISMA_URL` est bien défini dans Vercel
- Redéployez après avoir ajouté les variables

### Erreur de build
- Consultez les logs dans l'onglet "Deployments" de Vercel
- Vérifiez que le build local fonctionne : `pnpm build`

### Problèmes d'authentification
- Vérifiez que `AUTH_SECRET` est défini
- Vérifiez que `AUTH_URL` pointe vers votre domaine Vercel

---

## 📊 Monitoring et Analytics

Vercel offre automatiquement :
- **Analytics** : Nombre de visiteurs, pages vues
- **Logs** : Logs en temps réel de votre application
- **Performance** : Métriques de performance (Core Web Vitals)

Accédez-y depuis le dashboard Vercel > votre projet.

---

## 🎯 Domaine personnalisé (optionnel)

1. Allez dans **Settings** > **Domains**
2. Ajoutez votre domaine personnalisé
3. Suivez les instructions pour configurer les DNS
4. Mettez à jour `AUTH_URL` avec votre nouveau domaine

---

## ✨ Commandes utiles

```bash
# Voir les déploiements
vercel ls

# Déployer manuellement
vercel --prod

# Voir les logs
vercel logs

# Ouvrir le dashboard
vercel open
```

---

## 🎉 Félicitations !

Votre application Habit Tracker est maintenant en ligne et accessible à tous ! 🚀

**URL de production** : `https://votre-app.vercel.app`

---

## 📝 Checklist finale

- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Base de données initialisée (tables créées)
- [ ] Données de test ajoutées (seed)
- [ ] Test de connexion/inscription
- [ ] Test de création d'activité
- [ ] Vérification du dashboard
- [ ] Analytics activés
- [ ] Domaine personnalisé (optionnel)

**Bon déploiement ! 🎊**
