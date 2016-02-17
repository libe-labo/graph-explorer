# Explorons des graphs !

Le fichier `graph.json` est chargé par [sigma.js](https://github.com/jacomyal/sigma.js/tree/master/plugins/sigma.parsers.json) dès le chargement de la page.  
L'affichage des nœuds est filtré par rapport à la description présente dans le fichier `steps.tsv`.

| id | slug | texte | nodes |
| --- | ---- | ----- | --------- |
| 1 | 30 février 2912 | Lorem ipsum dolor sit amet | *&lt;node-id&gt;*,*&lt;node-id&gt;* |
| 2 | ... | ... | ... |
| ... | ... | ... | ... |

Chaque ligne de `steps.tsv` est une étape de la visualisation avec son propre slug, texte et les nœuds qui doivent y être affichés. Une étape affiche toujours les nœuds de l'étape précédente en plus de ses propres nœuds.

## Dépendances

* [sigma.js](https://github.com/jacomyal/sigma.js)
* [d3-dsv](https://github.com/d3/d3-dsv)
* [d3-scale](https://github.com/d3/d3-scale)
* [Font Awesome](https://fortawesome.github.io/Font-Awesome/)

## Licence

> The MIT License (MIT)
>
> Copyright (c) 2016 Libé Six Plus
>
>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
>
