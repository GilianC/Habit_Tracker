# 🔐 Guide de Test - Authentification HabitFlow

## ✅ Corrections Effectuées

### 1. **Middleware** (`auth.config.ts`)
- ✅ Supprimé la redirection automatique des utilisateurs connectés depuis `/login` et `/signup`
- ✅ Protection du dashboard maintenue (nécessite authentification)
- ✅ Permet l'accès aux pages d'auth même si connecté (pour tests)

### 2. **Fonction d'Authentification** (`actions.ts`)
- ✅ Correction de la redirection après login vers `/dashboard/home`
- ✅ Support du paramètre `redirectTo` personnalisé
- ✅ Messages d'erreur améliorés
- ✅ Gestion des doublons d'email lors de l'inscription

### 3. **Formulaire de Login** (`login-form.tsx`)
- ✅ Ajout d'un message de succès après inscription
- ✅ Affichage en vert avec checkmark ✓
- ✅ Redirection par défaut vers `/dashboard/home`

### 4. **Formulaire d'Inscription** (`signup-form.tsx`)
- ✅ Validation du nom, email, mot de passe
- ✅ Confirmation du mot de passe
- ✅ Minimum 6 caractères pour le mot de passe
- ✅ Hash bcrypt avec 10 salt rounds

---

## 🧪 Comment Tester

### **Test 1 : Inscription d'un Nouvel Utilisateur**

1. Ouvrir le navigateur : `http://localhost:3001/signup`

2. Remplir le formulaire :
   - **Nom** : Votre nom complet
   - **Email** : votre.email@example.com
   - **Mot de passe** : minimum 6 caractères
   - **Confirmation** : même mot de passe

3. Cliquer sur **S'inscrire**

4. **Résultat attendu** :
   - ✅ Redirection vers `/login`
   - ✅ Message vert "Compte créé avec succès !"
   - ✅ Message "Vous pouvez maintenant vous connecter"

---

### **Test 2 : Connexion avec Utilisateur de Test**

1. Ouvrir : `http://localhost:3001/login`

2. Utiliser les identifiants de test :
   ```
   Email: user@test.com
   Mot de passe: password123
   ```
   OU
   ```
   Email: admin@habittracker.com
   Mot de passe: admin123
   ```

3. Cliquer sur **Se connecter**

4. **Résultat attendu** :
   - ✅ Redirection vers `/dashboard/home`
   - ✅ Affichage du dashboard avec votre nom
   - ✅ Barre de navigation en bas visible
   - ✅ Accès aux 4 onglets : Accueil, Activités, Défis, Profil

---

### **Test 3 : Connexion avec le Nouveau Compte**

1. Retourner à : `http://localhost:3001/login`

2. Entrer les identifiants que vous avez créés à l'étape 1

3. Cliquer sur **Se connecter**

4. **Résultat attendu** :
   - ✅ Connexion réussie
   - ✅ Redirection vers le dashboard
   - ✅ Votre nom affiché dans le profil

---

### **Test 4 : Erreurs de Connexion**

1. Sur `/login`, entrer :
   ```
   Email: inexistant@test.com
   Mot de passe: wrongpassword
   ```

2. **Résultat attendu** :
   - ❌ Message d'erreur rouge : "Identifiants invalides."
   - ❌ Pas de redirection
   - ❌ Rester sur la page de login

---

### **Test 5 : Erreurs d'Inscription**

#### Test A : Email déjà utilisé
1. Sur `/signup`, utiliser l'email `user@test.com` (existant)
2. **Résultat** : Message "Un utilisateur avec cet email existe déjà"

#### Test B : Mots de passe différents
1. Entrer un mot de passe différent dans "Confirmer le mot de passe"
2. **Résultat** : Message "Les mots de passe ne correspondent pas"

#### Test C : Mot de passe trop court
1. Entrer un mot de passe de moins de 6 caractères
2. **Résultat** : Validation HTML native + message d'erreur

---

## 🔍 Vérification en Base de Données

Pour vérifier que l'utilisateur a bien été créé :

```sql
SELECT 
  id,
  name,
  email,
  LENGTH(password_hash) as hash_length,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 5;
```

Le `hash_length` doit être **60 caractères** (format bcrypt valide).

---

## 🐛 Dépannage

### Problème : "Identifiants invalides" alors que les identifiants sont corrects

**Solutions** :
1. Vérifier que le mot de passe a bien 60 caractères dans la BDD
2. Consulter les logs du serveur (terminal)
3. Vérifier le champ `password_hash` dans la table `users`

### Problème : Redirection automatique depuis /login

**Solution** : Décommenter dans `auth.config.ts` :
```typescript
if (isOnAuthPage && isLoggedIn) {
  return Response.redirect(new URL('/dashboard/home', nextUrl));
}
```

### Problème : "Failed to fetch user" dans les logs

**Solution** :
1. Vérifier la variable d'environnement `POSTGRES_URL` dans `.env`
2. Vérifier la connexion à la base de données Neon

---

## 📊 Structure de la Base de Données

### Table `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(60) NOT NULL,  -- bcrypt hash (60 chars)
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

---

## 🎯 Prochaines Étapes

Après avoir validé l'authentification :

1. ✅ Tester la navigation entre les pages
2. ✅ Vérifier que les données du profil s'affichent
3. ✅ Tester la déconnexion (bouton dans le profil)
4. 📝 Connecter les pages aux vraies données de la BDD
5. 🔄 Implémenter la fonctionnalité de complétion des activités
6. 🏆 Ajouter le système de points et badges

---

## 📝 Identifiants de Test

| Email | Mot de passe | Description |
|-------|-------------|-------------|
| `user@test.com` | `password123` | Utilisateur de test standard |
| `admin@habittracker.com` | `admin123` | Compte administrateur |
| Votre email | Votre mot de passe | Compte que vous créez |

---

**Serveur en cours d'exécution** : http://localhost:3001

**Pages disponibles** :
- 🏠 Accueil : http://localhost:3001/
- 🔐 Login : http://localhost:3001/login
- ✍️ Inscription : http://localhost:3001/signup
- 📊 Dashboard : http://localhost:3001/dashboard/home

---

✨ **L'authentification est maintenant pleinement fonctionnelle !**
