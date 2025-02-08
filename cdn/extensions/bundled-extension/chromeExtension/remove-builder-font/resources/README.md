# Efaz's Builder Font Remover

## Dynamic Resources
If you want to create a dynamic resources URL, make sure you have a valid JSON file that resembles Template.json

### Example
Resources URL: https://example.com/font-resources.json<br/>
When a WOFF Font is needed: https://domain.com/Book.woff<br/>
When a WOFF2 Font is needed: https://anotherdomain.com/Bold.woff2<br/>

## Legacy Resources
If you want to create a normal resources URL, make sure the following files are valid in your resources folder: 
```
Mono.woff 
Mono.woff2 
Black.woff 
Black.woff2 
Bold.woff 
Bold.woff2 
Book.woff 
Book.woff2 
Light.woff 
Light.woff2 
Medium.woff 
Medium.woff2
```
You may try to adapt the font files to fit the Roblox website, Creator Dashboard and DevForum.
<br/>

### Example
Resources URL: https://example.com/font-resource/<br/>
When a WOFF Font is needed: https://example.com/font-resource/Book.woff<br/>
When a WOFF2 Font is needed: https://example.com/font-resource/Book.woff2<br/>