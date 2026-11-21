# Le Parc à Huîtres · Hendaye

Site vitrine du Parc à Huîtres (Perle d'Hendaye), 5 rue des Orangers, 64700 Hendaye.

Une seule page statique (`index.html`), publiée avec GitHub Pages.

## Relié à Growth Gusto

Tout ce qui change se gère dans l'app Growth Gusto (app.growthgusto.fr), pas ici :

- horaires, fermetures exceptionnelles, annonce du moment : **Votre site internet** et **Fiche Google** ;
- la carte (plats, prix, descriptions, photos, allergènes, plats « sur place » ou « à emporter » seulement, prix à emporter) : **Commandes en ligne › La carte** ; l'espagnol et l'anglais : **Gusto AI › La carte traduite** ;
- la vente à emporter (créneaux, validation des commandes) : **Commandes en ligne › Réglages** ; les commandes arrivent dans l'app ;
- la réservation : **Réservations** (le module est posé dans la page Réserver).

`gg-parc.js` lit ces données par `https://app.growthgusto.fr/w/gg-site.js`. L'identifiant de l'établissement va dans `<meta name="gg-r" content="…">` en haut de `index.html` (on peut essayer sans le publier avec `?gg=<identifiant>`). Sans identifiant, la page garde ses données d'exemple.
