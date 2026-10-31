<?php if (!defined('ABSPATH')) { exit; } ?>
<div id="ttg-voice" class="ttgv">
<button class="ttgv-launch" aria-expanded="false" aria-controls="ttgv-panel">Joyee · TOPTOUR</button>
<section id="ttgv-panel" hidden aria-label="Joyee — AI asistentka TOPTOUR">
<header tabindex="0" aria-label="Presun panelu: potiahnite alebo použite šípky"><strong>Joyee · TOPTOUR</strong><button type="button" class="ttgv-min" aria-label="Zbaliť komunikátor">−</button></header>
<div class="ttgv-body">
<p class="ttgv-status" role="status">AI asistentka · Hlas alebo text / Voice or text</p>
<label class="ttgv-consent"><input type="checkbox"> Súhlasím so spracovaním rozhovoru cez Google Gemini a odovzdaním požiadavky TOPTOUR. / I agree to processing.</label>
<div class="ttgv-log" role="log" aria-label="Prepis rozhovoru"></div>
<div class="ttgv-controls"><button class="ttgv-call">Hovoriť / Talk</button><button class="ttgv-stop" disabled>Ukončiť hlas</button><button class="ttgv-language">Jazyk / Language</button></div>
<div class="ttgv-languages" hidden><label>Vyberte jazyk / Choose language <select><option value="sk">Slovenčina</option><option value="en">English</option><option value="de">Deutsch</option><option value="fr">Français</option><option value="es">Español</option></select></label><button class="ttgv-retry">Skúsiť znova / Retry</button><button class="ttgv-write">Napísať / Write</button></div>
<form class="ttgv-text"><label>Správa / Message<textarea required maxlength="3000" rows="2"></textarea></label><button>Odoslať / Send</button></form>
<details class="ttgv-inquiry"><summary>Odovzdať požiadavku / Send enquiry</summary><form>
<label>E-mail<input name="email" type="email" maxlength="190"></label><label>Telefón / Phone<input name="phone" type="tel" maxlength="80"></label>
<label>Vaša požiadavka / Your request<textarea name="message" rows="3" maxlength="8000"></textarea></label>
<label><input name="confirmed" type="checkbox" required> Potvrdzujem údaje a odoslanie rozhovoru. / Confirm and submit.</label><button>Uložiť požiadavku / Submit enquiry</button></form></details>
</div></section></div>
