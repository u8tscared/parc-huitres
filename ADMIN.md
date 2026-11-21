# Espace admin du site · mode d'emploi

L'espace admin permet à l'équipe de modifier le site sans toucher au code :
la carte et les prix, la vente à emporter, les horaires, les coordonnées et les textes.

**Adresse : https://u8tscared.github.io/parc-huitres/admin/**

## Ce qu'on peut modifier

| Rubrique | Ce qu'elle contient |
| --- | --- |
| **Fermé / complet** | En un clic : « Complet » (plus de tables, l'emporter reste ouvert) ou « Fermé » (ni tables ni emporter) pour aujourd'hui. Un bandeau s'affiche en haut du site. Avec la date du jour, le site redevient normal tout seul le lendemain. |
| **Coordonnées** | Nom, adresse, téléphone, e-mail, liens Instagram et Facebook, note et nombre d'avis Google. |
| **Horaires** | La semaine type (jours ouverts, services du midi et du soir), les fermetures exceptionnelles, et un message affiché en haut du site (par exemple « Horaires d'hiver à partir du 1er novembre »). |
| **Nos huîtres** | Chaque huître : nom, calibre, origine, prix sur place, prix à emporter, niveau d'iode, description. Elles apparaissent sur l'accueil, sur la carte et dans la vente à emporter. |
| **La carte** | Toutes les rubriques et tous les plats servis sur place (hors huîtres) : noms, descriptions, prix, allergènes, dessin. On peut ajouter, supprimer et réordonner. |
| **À emporter** | Supplément pour les huîtres ouvertes, consignes des plateaux, créneaux de retrait, et les produits à emporter (hors huîtres). |
| **Photos** | La galerie de la page La Maison (avec légendes). Chaque plat, huître ou produit à emporter peut aussi avoir sa photo, qui remplace le dessin : elle s'ajoute dans sa fiche. |
| **Textes du site** | Les textes des pages (accueil, La Maison, carte, à emporter, contact), les questions fréquentes et les avis clients. |
| **Mentions légales** | Raison sociale, SIRET, RCS, TVA, directeur de la publication, hébergeur, texte sur les données personnelles. Elles s'affichent sur la page « Mentions légales » du site (lien en bas de page). **À remplir.** |

La **carte en PDF** se fabrique toute seule à partir de « Nos huîtres » et « La carte » : bouton « Carte en PDF » sur la page La Carte (adresse directe : https://u8tscared.github.io/parc-huitres/carte-pdf.html). Elle est donc toujours à jour.

**Si le site est relié à Growth Gusto** (voir README.md), la carte, les huîtres et leurs prix, les horaires, les fermetures, la vente à emporter et la réservation se gèrent dans l'app Growth Gusto : les fiches de l'admin correspondantes ne s'affichent plus sur le site. Les coordonnées, textes, photos, le mode fermé / complet et les mentions légales restent dans l'admin.

La réservation se fait avec le module Growth Gusto dès que le site y est relié.

## Comment ça marche

1. On ouvre une rubrique, on modifie, on clique sur **Enregistrer**.
2. Le site en ligne est à jour **une à deux minutes plus tard** (rechargez la page du site).
3. Chaque modification est gardée dans l'historique : on peut toujours revenir en arrière.

Quelques règles de saisie :

- **Prix** : écrire `26,40`. Pour les vins, `3,90 / 22,80` (verre / bouteille). Un prix vide affiche « Selon cours ».
- **Traductions** : l'espagnol et l'anglais sont rangés dans « Traductions » (ou à côté du français pour les textes). Ils ne se traduisent pas tout seuls : **si vous changez le français, changez aussi l'espagnol et l'anglais, ou videz-les** (le site affichera alors le français).
- **Photos** : de préférence en format paysage, et pas trop lourdes (moins de 1 Mo).
- **Horaires** : un jour décoché est affiché « Fermé ». Le site s'en sert aussi pour proposer les jours de retrait à emporter et les jours du calendrier de réservation.
- **Fermetures exceptionnelles** : ces jours-là, le site affiche « Fermé » et ne propose pas de retrait. Les dates passées sont ignorées.

## Se connecter (une fois par personne et par appareil)

L'accès est protégé par GitHub : seules les personnes autorisées sur le dépôt du site peuvent enregistrer.

1. **Créer un compte GitHub** (gratuit) sur https://github.com/signup.
   Conseil : créez un compte au nom du restaurant, avec l'adresse e-mail du restaurant, pour ne dépendre de personne.
2. **Se faire inviter** : la personne qui gère le dépôt va sur
   https://github.com/u8tscared/parc-huitres/settings/access → *Add people*, et ajoute le compte.
   Acceptez l'invitation reçue par e-mail.
3. **Créer une clé d'accès** sur https://github.com/settings/personal-access-tokens/new :
   - *Token name* : `Admin site`
   - *Expiration* : la durée la plus longue proposée (notez la date : il faudra en refaire une)
   - *Repository access* : *Only select repositories* → `parc-huitres`
   - *Permissions* → *Repository permissions* → *Contents* : **Read and write**
   - Cliquez sur *Generate token* et copiez la clé (elle commence par `github_pat_`).
4. Ouvrez l'admin, cliquez sur **Se connecter avec un jeton d'accès**, collez la clé. C'est fini : l'appareil s'en souvient.

Sur téléphone : une fois connecté sur l'ordinateur, le menu du compte propose **Se connecter sur mobile** avec un code QR à scanner.

Pour retirer l'accès à quelqu'un : supprimez son compte dans
https://github.com/u8tscared/parc-huitres/settings/access.

## Pour que le restaurant reste autonome

Le dépôt du site appartient aujourd'hui au compte GitHub de Marceau. Pour que l'équipe garde la main
dans tous les cas, le plus sûr est de **transférer le dépôt au compte du restaurant**
(*Settings → General → Transfer ownership*). Après un transfert, il faut remplacer `u8tscared`
par le nouveau nom de compte dans `admin/config.yml` (ligne `repo:`), et l'adresse du site change.

## Pour un développeur

- Le contenu est dans `content/*.json`. `index.html` le charge au démarrage (`loadContent()` puis `buildContent()`).
- L'admin est [Sveltia CMS](https://sveltiacms.app/), chargé depuis `admin/index.html` et réglé par `admin/config.yml`.
  Chaque enregistrement fait un commit sur `main`, que GitHub Pages publie.
- Avec un nom de domaine personnalisé, mettre à jour `site_url` et `logo` dans `admin/config.yml`.
- Pour voir le site en local, il faut un petit serveur (le site lit des fichiers JSON) :
  `python3 -m http.server` puis http://localhost:8000.
- Connexion par bouton « Se connecter avec GitHub » (au lieu de la clé) : possible en installant
  [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) sur Cloudflare Workers,
  puis en ajoutant `base_url` et `oauth` dans `auth_methods` de `admin/config.yml`.
