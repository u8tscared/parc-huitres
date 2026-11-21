# Le Parc à Huîtres · Hendaye

Site vitrine du Parc à Huîtres (Perle d'Hendaye), 5 rue des Orangers, 64700 Hendaye.

Une page statique (`index.html`), publiée avec GitHub Pages. Le contenu vient de deux endroits :

## L'espace admin du site (`/admin/`)

Les fichiers `content/*.json` se modifient depuis https://u8tscared.github.io/parc-huitres/admin/
(mode d'emploi : [ADMIN.md](ADMIN.md)) : coordonnées, textes des pages, FAQ et avis, photos et galerie,
mode fermé / complet du jour, mentions légales. On y trouve aussi la carte, les horaires et la vente à emporter :
ce sont les données affichées tant que le site n'est pas relié à Growth Gusto.

## Relié à Growth Gusto

Une fois l'identifiant renseigné, ce qui suit se gère dans l'app Growth Gusto (app.growthgusto.fr) et remplace
la carte, les horaires et l'emporter de l'admin :

- horaires, fermetures exceptionnelles, annonce du moment : **Votre site internet** et **Fiche Google** ;
- la carte (plats, prix, descriptions, photos, allergènes, plats « sur place » ou « à emporter » seulement, prix à emporter) : **Commandes en ligne › La carte** ; l'espagnol et l'anglais : **Gusto AI › La carte traduite** ;
- la vente à emporter (créneaux, validation des commandes) : **Commandes en ligne › Réglages** ; les commandes arrivent dans l'app ;
- la réservation : **Réservations** (le module est posé dans la page Réserver).

`gg-parc.js` lit ces données par `https://app.growthgusto.fr/w/gg-site.js`. L'identifiant de l'établissement va dans `<meta name="gg-r" content="…">` en haut de `index.html` (on peut essayer sans le publier avec `?gg=<identifiant>`). Sans identifiant, la page utilise les données de l'admin. Les dessins et les photos ajoutées dans l'admin restent affichés pour les plats de même nom.
