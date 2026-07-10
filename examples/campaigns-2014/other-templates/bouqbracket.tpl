<script src="https://www.thebouqs.com/themes/30bouqs/js/jquery/idangerous.swiper.js"></script>

<!-- mobile header -->
<div id="bgtop"></div>
{if not $cookie->fromApp}
    <div class="topFixed visible-phone" id="header">
        <div class="row-fluid">
            <div class="navOperation">
                <h1>{if $cms->alternative_title!=''}{$cms->alternative_title}{else}{$cms->meta_title}{/if}</h1>
            </div>
        </div>
    </div>
{/if}

<style>
@import url('https://www.thebouqs.com/themes/30bouqs/css/jquery/idangerous.swiper.css');
@font-face {
    font-family: 'flowerpower';
    src: url('https://www.thebouqs.com/img/cms/mail/_a/fonts/flowerpower.eot');
    src: url('https://www.thebouqs.com/img/cms/mail/_a/fonts/flowerpower.eot?#iefix') format('embedded-opentype'),
         url('https://www.thebouqs.com/img/cms/mail/_a/fonts/flowerpower.woff') format('woff'),
         url('https://www.thebouqs.com/img/cms/mail/_a/fonts/flowerpower.ttf') format('truetype'),
         url('https://www.thebouqs.com/img/cms/mail/_a/fonts/flowerpower.svg#FlowerPower') format('svg');
    font-weight: normal;
    font-style: normal;
}

/* Front-page */
em { font-style:normal; }
#brackets { background:url('https://www.thebouqs.com/img/cms/bouq-bracket/brackets.gif') center center no-repeat;margin:0 auto;height:460px;width:100%;margin-top:50px; }
#winner { background-image: url(data:image/gif;base64,R0lGODlhmQB2ALMAAP7+/vz8/NbW1s7OztLS0uvr6/n5+fX19eDg4PHx8dvb2+Xl5czMzP///wAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNBRDNCQjAzQTE5NjExRTM5QTMzRDI3NDM1RkJBOTIxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNBRDNCQjA0QTE5NjExRTM5QTMzRDI3NDM1RkJBOTIxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0FEM0JCMDFBMTk2MTFFMzlBMzNEMjc0MzVGQkE5MjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0FEM0JCMDJBMTk2MTFFMzlBMzNEMjc0MzVGQkE5MjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW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);margin:0 auto;width:153px;height:118px;margin-top:90px; }
#play,#picked { font:20px/40px 'proxima_novasemibold',Arial,sans-serif;color:#fff;height:48px;margin-left:auto;margin-right:auto;display:block;max-width:275px;background-repeat:no-repeat;text-align:center; }
#play { background-image:url('data:image/gif;base64,R0lGODlhDgEyALMOAPPz8/39/ebm5qWlpZWVlZ6ens7OztHR0dnZ2cbGxri4uMrKypmZmczMzP///wAAACH5BAEAAA4ALAAAAAAOATIAAAT/0MlJq724otW6/2AojmRpnmiqrmyLGkImz3Rt15ur73zv/8AP7EYsGom5oHLJbDpDw6N0Ok0+r9isVhSler8z63ZMLve64LTaITa733BobE3/tuP4/BZd7xfveoGCSnx+hjSAg4qLLYWHjxeJjJOUI46QmBKSlZyVl5mQm52jip+gh6Kkqnmmp36pq7FurXUBtre4ubq7tgC8trCywntzoAAIyMnKy8zNzsoGw9J6CADW19jZ2tvc2LYGC+Hi4+Tl5ufi0+pxCwnu7+/t8PP09fUADgAc6/z9cAgBHARA4K+gwSwGAkoAcLChwyDFND2cSHHFAYUTAkSryLEjCHwW/wR4HMnx4oUAB0iqbGgA5AWGK2P2A5gBpcyb0hLOALARp09SAjBiGPizKCedNAIYXboIhtCaAnoynQrHpA2NVLO+cWmDp9avW2gS8Qq2rJOWRYgyMcC2rdu3B+LKjSvPnt27ePPq3cu3r1+9BubGfUuY8FquNfQxqTtPQQIFkCNLjiygm+XLmDNr3sy5s+dsjyeLxisViNUaNhcrGFBggOvXBWLLnh2bAQHErnLrHqqAAe3ZsF8Ld1waSMQZAvYtMfB4AIHn0KNLZ0D9Oe7d2HcHUECguvTv0VsneIJ0RuomgZt3p86+vXvb17PLB7V9/fv73QcoaFBciVgZImHBVvYCrNl3X3u3zadgbvUd6N5z+iVwQH9KLBBfRsoJ2MBqtjnIXoILhohJgx7aVoBjE25xmgVq7XFAcyXCJ+KMh5B4YH4KsEWGhRkoVkZ6BToIIo1ErmHjffotkJIZ5VFwHpMGcHjjhUVWmRZ3B4qXohsLBGWBj1U9VgB+VFppZlJYuteaAlvCscBTWLHyImsPlnnmnSelyd6JC1Boxn8BBBgIW1JWZyeeiEpgo5Z+msGjohkOKqahiVYqA4n66aiISS0uMqeMloZaQX0n8keJLzwVpuqqrLbqKlsH9HaoqFZuN0ACjeqR0GeXVcZrr0/RWmmgkVIiQAQAOw=='); }
a#play { text-decoration:none; }
#picked { background:url('data:image/gif;base64,R0lGODlhDQEwAMQfALlxs/Lm8syZyPnz+L9/u4ozg9u32K1Zp8SJwLNkrfDl7+LE4JE4i6NFnPz5/NCgzdar05k8kujQ5qdNoO7c7IIvfODA3X4seLZrsKNinp9AmPfv9nwrdv///6FBmv///yH5BAEAAB8ALAAAAAANATAAAAX/4CeOZGmeaOmtbOu+cCzPdG3feK7veJL+wKBwKOQZj8ikcsl8+YjQqJTYrFqv2KzsOe16u9qweEymcb/o9K/MbrurZ7V8/q7b77X4fP/F+/93enyDUYCGh2OChItBYQcJiDAJB0kHlDkJE4GMnFRXBwsDHaMLkCujqB0UEJoeD6mpLgGjCCywqRIxBBKoA6wrvA8urx0toKIdA6Uto8IsAhS9zh63zR68uUyKndwjVwjVHbXU1RQrxLctAKjmp+HZLgvlmsHDoywIyLDj5M4TvLcoaAonDFuTbd24WUkwagCBCRMIiArgzhkAeeJcdYAHw0AqUyzWFZNBTAIADweI/xm41mHauXseGCZ7GBGZKWsePHZYlkCngH4wDGpLSFRFlVkDWq04wA+nhwnWXnF0AbWDgFkr1cGEcWDUVATj6rUgBiyZ0qeislmTCcEFhHFOW0DYeLCo3Q9VqvKD4bRrS41TWwgYdWBuUq0jYRAgLEMsC7JA7Y2MOuqsi7iP6Q4tKoCA58+gQ4seTRp0FZGmEDxYvZrSKAMAAFwddRIdLhazFqCkhZhkshkAw8Wk/ULkSWvyAjOrJuyVyyQJBkifTr269evYq+uOdEPkpeDEw2W1jSqbzHHR2q0QKWMuxcbh7hkvHv6v0BgENT7nLoPAh5P80eAXAStAIIEE0XRwXP8HAUgwSwcEvqRcTrTFNlcHl3jAXgyDdWBZC469NFlGLoDjIVCvvIffXy84FyANDQTwgQINvDiDKOqtV58wIk0jFQwT6ANLWzom5sQoRLIwSVnPQTaLirgxWJEHJv6kTiuYrfcAgDbC8MAIVnb5QocLtDLBhQs6g9ElP75gYjUDhLQVDBhNE519LGY20mI7mYlRhDhFM0CY4DgUWXFicuXACANkmCgLwR2IjECRHZDWSwMcqGkugpbIm4ZzvhBkQw6iAkmIGiWm00bBZRXZnQxKgEyj5DS4aS0eTWjjAiW4+ugzQnaQpFPE1EKeqUhSdSmoRgJ5ISoBmIIqZCsIIOT/oMtNAwosEtzEnAfy5JiofyZg8CtVsj2AgKOxsQsAJAfEJq+88QLwYQKxrTBBvjXs+4AAXMYEgKMo8auOAAAXN7AL8aoLkobz0vvUuuc2oMAJFNR47sYcPypACnt1LPLIgBywKAqHkazyym9YAESSLMcs8xUABNHBwzPnrPMODVAghK47By20YESEPPTRQltKxAYfIu20zAZEAfPTVK+MgRRhVq31yC5DQePWYIuMQQdQBNyEBgykrfbaDBTg9ttwV1CAgwHUbffdeOet99589+3334AHLvjgdWcA9+EFsK04AxFkAQER22ERQQUcVG755ZhnfvFdnHeeQgaZhy56/wEaZBGkEA4QbAXaF4jueuWbey677KC/LnoFjYeBgBD7YaFBAbaHHvvsxNtVe/CWX8AAGT0DEYDGZEyOvOXDF289N8cHfwHpbFz9Q4RtMNA68tVfbz4h2b9eQO5tRI0C0GH8Pv7r5Z9vvxzph467HUqb4ADObogA8Oh3vwLuIX+XU17p7vAxE0zNDtITXf0MSMEoILBy3PND80jANEOwTngVDGEXELg/Q9SMBEbzw+80J8IWQiF9yuNO1z4AvztEEHYuzGEQjre9BUbCZB+4mY3Eh0MdGvEEtVufjb70QO6scIJHzGEGSmgji0EAYVjMoha3yMUuevGLXcxHFMcoAgcB+LBLBAgBADs=');background-repeat:no-repeat;background-position:center center; }
#modal { width:465px; display:none;z-index:1001;position:absolute;left:50%;top:50%;margin-left:-232.5px;margin-top:-187.5px;border-radius:4px 4px 4px 4px;border:1px solid #6d6d6d; }
#modaloverlay { display:none;position:absolute;left:0%;top:0%;background-color:#333;-moz-opacity:0.45;opacity:.45;filter:alpha(opacity=40);width:100%;height:100%;z-index:1000; }
h2.bracket { font:24px/33px 'proxima_novasemibold',Arial,sans-serif;color:#999;text-align:center; }
.thumbnails { width:100%;min-height:320px; }
.thumbnails li { width:225px;height:225px;text-align:center;margin:0 auto;display:inline-block;background-position:center center;background-repeat:no-repeat; }
.thumbnails li:nth-child(1) { background-image: url('data:image/gif;base64,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');}
.thumbnails li:nth-child(2) { background-image: url('data:image/gif;base64,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'); }
.thumbnails li:nth-child(3) { background-image: url('data:image/gif;base64,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');}
ul.thumbnails div { position:relative;top:255px;text-align:center }
ul.thumbnails h4 { font:18px/30px 'proxima_novaregular',Arial,sans-serif;color:#a1419a; }
ul.thumbnails p { font:14px/18px 'proxima_novaregular',Arial,sans-serif;color:#666;width:100%;max-width:160px;margin-top:15px;}



/* Modal globals */
.modal { margin-left:-230px;max-width:465px; }
#myModal { width:465px;background:#fff;max-height:375px; }
.modal-header,.m-footer { background:#e1e1e1;}
#dismissModal { float:right;font-size:20px;font-weight:bold;line-height:18px;color:#333;text-shadow:0px 1px 0px #fff;opacity:0.2;margin-top:2px;margin-right:2px;font-family:'Verdana',Arial,sans-serif;text-decoration:none; }
hgroup { height:140px;text-align:center;color:#666; }
.modal-header h3 { line-height:35px;font-size:40px;font-family:'flowerpower',Arial,sans-serif;padding-top:10px;text-transform:uppercase; }
hgroup h4 { font:15px/18px 'proxima_novaregular',Arial,sans-serif;margin-top:15px;text-transform:none; }

/* Modal footer */
#modal-pagination .arrow { font:14px/42px 'proxima_novasemibold',Arial,sans-serif;color:#999;float:left; }
#modal-pagination #forward.arrow { float:right!important; }
.arrow a { color:#999;text-decoration:none; }
#modal-pagination { height:23px;font-size:12px;list-style-type:none;margin:0;padding-top:10px;padding-bottom:12px;width:100%; }
ul#pagination { list-style: none; margin:0 auto;display: block;width:100%; }
ul#pagination li { position: relative; float: left; display: block;position:relative;top:4px; }
#pagination { width:130px;padding:0;z-index:1; }
footer#modal-pagination .arrow { float:left;position:relative;bottom:25%;}
#back.arrow { margin-left:25px; }
#forward.arrow { margin-right:25px; }

li.step { background:#cccccc;border-radius:7px;-moz-border-radius:7px;-webkit-border-radius:7px;color:#ffffff;display:inline-block;font-weight:bold;line-height:15px;margin-right:5px;text-align:center;width:15px;color:#cccccc;z-index:2; }
li.step a { text-decoration:none;outline:none;color:#ccc;position:relative;top:1px; }
li.step.active,li.step.active a { background:#a1419a!important;position:relative!important;top:0px!important;border-radius:15px!important;-moz-border-radius:15px!important;-webkit-border-radius:15px!important;width:25px!important;line-height:25px!important;color:#ffffff!important;z-index:3!important; }
#active { color:#a1419a; }

/* Modal inner globals */
div[id^="display"] { height:150px;text-align:center;background:#fff; }
div[id^="display"]>h1 { color:#666;font:16px/18px 'proxima_novaregular',Arial,sans-serif;margin:20px; }
#display5 em { font:14px/19px 'proxima_novasemibold',Arial,sans-serif;color:#999;font-variant:normal;font-style:normal;text-decoration:none;display:block; }
#display5 em:first-of-type { margin-top:15px; }
#display5 em:last-of-type { margin-bottom:15px; }
#display5 h2 { font:18px/15px 'proxima_novasemibold',Arial,sans-serif;color:#a1419a;display:block;margin-top:2px; }
#display5 .change { width:195px;margin:0 auto;padding:6.75px 0 1px;border-radius:2.75px 2.75px 0 0;background-color:#666;display:block;font:18px/25px 'proxima_novasemibold',Arial,sans-serif;color:#fff; }
#display5 .confirm { width:195px;margin:0 auto;padding:6.75px 0 1px;border-radius:0 0 2.75px 2.75px;background-color:#a1419a;display:block;font:18px/25px 'proxima_novasemibold',Arial,sans-serif;color:#fff; }
.modal5ProductImage { margin:0 auto; }
.page6 { margin:0px auto; }
.page6 #modal5CollectionName,.page6 em { font-size:16px;font-style:normal; }
.page6 #modal5CollectionName { display:block;margin-bottom:20px; }
.page6 div.shop { margin:15px auto;width:195px;padding:9px 4px 3px;color:#fff;background-color:#993399;font-family:'proxima_novasemibold',Arial,sans-serif;font-size:20px;border-radius:2.75px; }
.page6 div.shop a { font-family:'proxima_novasemibold',Arial,sans-serif;color:#fff;text-decoration:none;display:block; }
.page6 #modal5ProductName { font-size:24px;line-height:30px;margin-bottom:-5px;margin-top:2px; }
.page6 span { display:block;font:18px/19px 'proxima_novasemibold',Arial,sans-serif;color:#993399; }
.page6 span b { font:22px 'proxima_novasemibold',Arial,sans-serif;color:#993399; }

/* Step 1 thru 3 */
div[id^="display"]:nth-child(-n+3) { height:180px; }

/* Step 4 thru 5 */
div[id^="display"]:nth-child(n+4) { height:265px; }

/* Facebook */
.fb-facepile { width:395px;display:block;margin-left:32.5px; }
.fb-share-button { display:block; }

/* Slider */

.container { text-align:center; }
.swiper-container { width:345px;max-width:345px;overflow:hidden;color:#fff;text-align:center; }
.swiper-slide { float:left; }
/* Sprites */
.bouq { background:url('https://www.thebouqs.com/img/cms/bouq-bracket/bouqbracket.jpg') no-repeat; }
.bouq:hover { background:url('https://www.thebouqs.com/img/cms/bouq-bracket/bouqbracket-hover.jpg') no-repeat; }
.bouq.selected { background:url('https://www.thebouqs.com/img/cms/bouq-bracket/bouqbracket-selected.jpg') no-repeat; }
#bouq0 { background-position:0 0;width:115px;height:115px; }
#bouq1 { background-position:-115px 0;width:115px;height:115px; }
#bouq2 { background-position:-230px 0;width:115px;height:115px; }
#bouq3 { background-position:0 -115px ;width:115px;height:115px; }
#bouq4 { background-position:-115px -115px ;width:115px;height:115px; }
#bouq5 { background-position:-230px -115px ;width:115px;height:115px; }
#bouq6 { background-position:0 -230px ;width:115px;height:115px; }
#bouq7 { background-position:-115px -230px ;width:115px;height:115px; }
#bouq8 { background-position:-230px -230px ;width:115px;height:115px; }
#bouq9 { background-position:0 -345px ;width:115px;height:115px; }
#bouq10 { background-position:-115px -345px ;width:115px;height:115px; }
#bouq11 { background-position:-230px -345px ;width:115px;height:115px; }
#bouq12 { background-position:0 -460px ;width:115px;height:115px; }
#bouq13 { background-position:-115px -460px ;width:115px;height:115px; }
#bouq14 { background-position:0 -575px ;width:115px;height:115px; }
#bouq15 { background-position:-115px -575px ;width:115px;height:115px; }

.swiper { font-family:'flowerpower';color:#ccc;font-size:80px;width:435px;cursor:pointer; }
.arrow-left,.arrow-right { font:100px 'flowerpower',Impact,'Arial Black',monospace;top:0px;position:relative;display:inherit; }
.arrow-left,.arrow-right,.arrow a,button.fblogin,button.fblogin .icon,.bouqs-btn,#dismissModal,#display5 .change,#display5 .confirm,#submitLogin,#btn_cart_fblogin,#modal5ProductName,#modal5CollectionName,div.icon,a#play { -webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: moz-none;-ms-user-select: none;-o-user-select: none;user-select: none; }
.arrow-left { float:left;margin-right:8px;margin-left:5px; }
.arrow-right { float:right;margin-right:5px; }
.bouqs-btn { padding:16px 0 3px;font-size:16px;line-height:10px; }
button.fblogin { margin:0 auto;width:225px;background-color:#637cb5;height:35px; }
button.fblogin .icon { float:left;top:-16px;width:45px;height:35px;position:relative;text-transform:lowercase;padding-left:16px;letter-spacing:10px;font-weight:bold;font-size:30px;line-height:45px;color:#fff;background:#3b599f; }
.modal input { max-width:213px;padding:7px 5px;margin-right:0; }
.bouqs-btn { max-width:220px; }
.modal-body { background-color:#fff; }
#submitLogin { margin-top:8px;width:225px;min-width:225px;background-color:#898989; }
#form_login span { text-align:center;margin:15px 0 10px;font-family:'proxima_novaregular',Arial,sans-serif;color:#666;font-size:18px;display:block; }
.fb-share-button span,.fb-share-button iframe { width:120px! important;height:25px! important; }

.aux-header,.aux-subheader { display:none; }
#mobilepage { display:none; }
@media only screen and (max-width:1028px) {
	#banner img { max-width:100%;height:auto; }
	#winner { margin:8% auto 0px; }
	#brackets { background-size:contain;background-position:top center;max-height:415px; }
	
}
@media only screen and (max-width:769px) {
#desktop1,#desktop2,#desktop3,#desktop4 { display:none!important; }
#mobilepage { display:block!important;width:100%;height:100%;margin:0;padding:0;}
#mobilepage h3 { font-size:20px;margin-top:8px;background-color:#ccc;border-bottom:1px solid #666;padding:13px 5px 5px;line-height:26px;color:#fff;text-shadow:0px 1px 0px #666; }
#mobilepage h4 { font-size:18px;line-height:24px;margin-top:22px; }
.arrow-left,.arrow-right { display:none!important; }
#form_login { text-align:center; }
select, textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"], .uneditable-input { padding:13px 35px; }
button.fblogin { width:280px;height:45px;margin:0 auto;margin-top:28px!important; }
.bouqs-btn { max-width:none;padding:21px 0 3px;font-size:20px }
#submitLogin { width:280px;padding:18px 0 8px; }
.swiper { width:auto!important; }
.swiper-container { min-width:100%;}
.fb-share-button { text-align:center;margin:15px; }
a.confirm { padding:18px 0 10px;margin:0 auto;width:75%;background-color:#898989; }
.shop { text-align:center;background-color:#993399;color:#fff;font-size:25px;padding:18px 0 10px;margin:15px auto 50px; }
#coupon { display:none; }
}

</style>

<div class="container">
	<div class="row-fluid">
		<div class="span12" id="banner"><img src="https://www.thebouqs.com/img/cms/bouq-bracket/h1.gif" alt="March Bouqness"></div>
	
	</div>
</div>

<div id="desktop1">
<div class="container">
	<div class="row-fluid">
		<div class="span12" id="brackets">
			<a href="#myModal" id="winner" role="button" data-toggle="modal" data-backdrop="static" style="display:block;"></a>
			<div class="page6">
				<em>You&#39;ve selected</em>
				<h2 id="modal5ProductName"></h2>
				<em id="modal5CollectionName"></em>
				<div class="modal5ProductImage bouq" id=""></div>
				<div id="picked"></div>
				<span>BTW&#44; SURPRISE&#33;</span>
				<span>Just for entering&#44; enjoy</span>
				<span><b>20&#37; OFF&#33;</b></span>
				<span>Use code &#34;SURPRISE&#34;</span>
				<span>&#64; CHECKOUT</span>
					<a href="/en/64-all" style="text-decoration:none;display:block;"><div class="shop">SHOP NOW</div></a>
					
			</div>
			<a href="#myModal" id="play" role="button" data-toggle="modal" data-backdrop="static">CLICK TO PICK</a>
		</div>
	</div>
</div>
</div>
<script>
var isLoggedIn = {if $cookie->isLoggedQuick()}1{else}0{/if};
{literal}
var currentPageId = 1;
var selectedBouqId = -1;
var campId = "BracketContest";
var customerId = 0;
var bouq = new Array()
for(var xx = 0; xx < 16; xx++) {
    bouq[xx] = [];
}
bouq[0][0] = "Candies";
bouq[1][0] = "Depth";
bouq[2][0] = "Fortified";
bouq[3][0] = "Good Karma";
bouq[4][0] = "Killer";
bouq[5][0] = "Hot Lava";
bouq[6][0] = "Lavanderia De Cali";
bouq[7][0] = "Magically Delicious";
bouq[8][0] = "Mohave";
bouq[9][0] = "Monterey";
bouq[10][0] = "Peace";
bouq[11][0] = "Pride";
bouq[12][0] = "Sierra Sunset";
bouq[13][0] = "Sunshine Twins";
bouq[14][0] = "Sweethearts";
bouq[15][0] = "Twist";
bouq[0][1] = "California";
bouq[1][1] = "Volcano";
bouq[2][1] = "Volcano";
bouq[3][1] = "Volcano";
bouq[4][1] = "Volcano";
bouq[5][1] = "Volcano";
bouq[6][1] = "California";
bouq[7][1] = "California";
bouq[8][1] = "California";
bouq[9][1] = "California";
bouq[10][1] = "Volcano";
bouq[11][1] = "Volcano";
bouq[12][1] = "California";
bouq[13][1] = "California";
bouq[14][1] = "California";
bouq[15][1] = "Volcano";

$('.page6').hide();

function dismissModal() {
	$("#myModal").modal("hide");
}

function displayPreviousPage() {
	var pageId = currentPageId - 1;
	if(pageId < 1 ) pageId = 1;
	
	if(pageId == 4) pageId = 3;
	
	displayPage(pageId);
}
function displayNextPage() {
	var pageId = currentPageId + 1;
	if(pageId > 5 ) pageId = 5;
	
	if(pageId == 4) {
		if(selectedBouqId < 0) return;
		if(isLoggedIn == 1) pageId = 5;
	}
	if(pageId == 5 && isLoggedIn == 0) pageId = 4;
	
	displayPage(pageId);
}

function displayPage(pageId) {
	currentPageId = pageId;
	$('div[id^="display"]').hide();
	$('#display'+pageId).show();
	$('.step').removeClass("active");
	$('#step'+pageId).addClass("active");
	
	if(pageId == 1 || pageId == 2) {
		FB.XFBML.parse();
	} else if(pageId == 3) {
		var mySwiper = new Swiper('.swiper-container',{
			calculateHeight:true,
	    slidesPerView: 3,
			slidesPerGroup: 3,
			loop:true
		});
		$('.arrow-left').on('click', function(e) {
			e.preventDefault();
			mySwiper.swipePrev();
		});
		$('.arrow-right').on('click', function(e) {
			e.preventDefault();
			mySwiper.swipeNext();
		});
	} else if(pageId == 5) {
		$("#modal5ProductName").html(bouq[selectedBouqId][0]);
		$("#modal5CollectionName").html(bouq[selectedBouqId][1]);
		$(".modal5ProductImage").attr("id","bouq"+selectedBouqId);
	}
	_gaq.push(['_trackEvent', campId, 'display', pageId]); // ga tracking
};

function selectBouq(x) {
	$(".bouq").removeClass("selected");
	$("#bouq"+x).addClass("selected");
	selectedBouqId = x;
}

function loginAjax() {
	loginInfoReset();
	if(!$('#form_login').valid()) return false;
	
	var email = $.trim($("#login_email").val());
	var password = $.trim($("#login_password").val());
	var actionUrl = $("#form_login").attr("action");
	$.post(actionUrl, { "ajax": "true", "login":"1", "email": email, "passwd": password },
			function(data) {
		var res;
		if(typeof data == 'string') {
			res = jQuery.parseJSON(data);
		} else {
			res = data;
		}
		if(res.hasError) {
			loginInfoShow(res.errors[0]);
			hideBusy();
		} else {
			customerId = res.data;
			isLoggedIn = 1;
			displayPage(5);
			_gaq.push(['_trackEvent', campId, 'Login', 1]); // ga tracking
		}
	});
}

function createNewAccount()
{
	loginInfoReset();
	if(!$('#form_login').valid()) return;
	var email = $.trim($("#login_email").val());
	var password = $.trim($("#login_password").val());
	var actionUrl = $("#form_login").attr("action");
	$.post(actionUrl, { "ajax": "true", "signupLight":"1", "email": email, "passwd": password },
		function(data) {
		try {
			var res;
			if(typeof data == 'string') {
				res = jQuery.parseJSON(data);
			} else {
				res = data;
			}
			if(res.hasError) {
				loginInfoShow(res.errors[0]);
                //$('#myModal').modal('toggle');
				hideBusy();
			} else {
				// success
				customerId = res.id_customer;
				isLoggedIn = 1;
				displayPage(5);
				
				_gaq.push(['_trackEvent', campId, 'Sign Up', 1]); // ga tracking
			}
		} catch(err) {
			loginInfoShow(err + "::" + data);
			hideBusy();
		}
	});
}
function loginInfoShow($msg) {
	$("#login_info").html($msg);
	$("#login_info").addClass("info");
}
function loginInfoReset() {
	$("#login_info").html("");
	$("#login_info").removeClass("info");
}
function closeModal() {
	_gaq.push(['_trackEvent', campId, 'selection', customerId, selectedBouqId]); // ga tracking
	$("#myModal").modal("hide");
	$("#winner").hide();
	$("#play").hide();
	$(".page6").show();
	$("#space").hide();
}
function fbLogin() {
	FB.login(function(response) {
	    if (response.authResponse) {
	        fbPsAjaxLogin();
	    }
	}, {scope: 'email,user_birthday'});
}
function fbPsAjaxLogin() {
	
	var actionUrl = $("#form_login").attr("action");
	$.post(actionUrl, { "ajax": "true", "fbPsLogin":"1", "welcome": 0 },
			function(data) {
		var res;
		if(typeof data == 'string') {
			res = jQuery.parseJSON(data);
		} else {
			res = data;
		}
		if(res.hasError) {
			alert(res.errors[0]);
			hideBusy();
		} else {
			// success & refresh form
			customerId = res.id_customer;
			isLoggedIn = 1;
			displayPage(5);
			
			_gaq.push(['_trackEvent', campId, 'Login FB', 1]); // ga tracking

		}
	});
	return false;
}

$(document).ready(function() {
	$("#myModal").on("show", function() {
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		
		
	});
});
window.fbAsyncInit = function() {
  FB.init({
    appId      : fbAppId,
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
};


_gaq.push(['_trackEvent', campId, 'load', 1]); // ga tracking
</script>
{/literal}

<div id="desktop2">
<div class="container hidden-phone">
    <div class="row-fluid marginT20 get-started">
        <h2 class="bracket" id="space">OK&#44; COOL&#8230; BUT HOW DOES IT WORK&#63;</h2>
    </div>
</div>
</div>

<div id="desktop3">
<div class="container hidden-phone">
	<div class="row-fluid marginT20">

		<ul class="thumbnails">
			<li class="span4">
				<div>
					<h4>&#35;BOUQOFF START</h4>
					<p>We post two Bouqs on our facebook page.</p>
				</div>
			</li>
			<li class="span4">
				<div>
					<h4>COUNT</h4>
					<p>We count the comments or &#34;votes&#34;</p>
				</div>
			</li>
			<li class="span4">
				<div>
					<h4>FINAL ROUND</h4>
					<p>The Winner progresses to the final round</p>
				</div>
			</li>
		</ul>
	</div>
</div>
</div>
<div id="desktop4">
<!-- Modal -->
<div id="fb-root"></div>
<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-header">
		<div id="dismissModal" onclick="dismissModal();">x</div>
		<hgroup class="block fixed">
			<h3>WIN A FREE GRAND BOUQ<br>ENTER IN 4 EASY STEPS</h3>
			<h4>If your pick wins our MARCH BOUQNESS bracket&#44;<br>you win a free grand bouq&#33;</h4>
		</hgroup>
	</div>
	<div class="modal-body" id="content">
		<div id="display1">
			<h1>LIKE OUR PAGE</h1>
			<div class="fb-like" data-href="https://www.facebook.com/TheBouqs" data-width="125" data-height="35" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
			<br><br>
			<div class="fb-facepile" data-href="https://www.facebook.com/TheBouqs" data-width="395" data-max-rows="1" data-colorscheme="light" data-size="large" data-show-count="true"></div>
		</div>
		<div id="display2" style="display:none;">
			<h1>SHARE THIS GIVEAWAY</h1>
			<div class="fb-share-button" data-href="https://www.facebook.com/TheBouqs" data-width="120" data-type="button_count"></div>
		</div>
		<div id="display3" style="display:none">
			<h1>PICK YOUR WINNING BOUQ&#33;</h1>
			<div class="swiper">
				<span class="arrow-left">&#x2039;</span>
				<span class="arrow-right">&#x203A;</span>
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<div class="swiper-slide bouq" id="bouq0" onClick="selectBouq(0)"></div>
						<div class="swiper-slide bouq" id="bouq1" onClick="selectBouq(1);"></div>
						<div class="swiper-slide bouq" id="bouq2" onClick="selectBouq(2);"></div>
						<div class="swiper-slide bouq" id="bouq3" onClick="selectBouq(3);"></div>
						<div class="swiper-slide bouq" id="bouq4" onClick="selectBouq(4);"></div>
						<div class="swiper-slide bouq" id="bouq5" onClick="selectBouq(5);"></div>
						<div class="swiper-slide bouq" id="bouq6" onClick="selectBouq(6);"></div>
						<div class="swiper-slide bouq" id="bouq7" onClick="selectBouq(7);"></div>
						<div class="swiper-slide bouq" id="bouq8" onClick="selectBouq(8);"></div>
						<div class="swiper-slide bouq" id="bouq9" onClick="selectBouq(9);"></div>
						<div class="swiper-slide bouq" id="bouq10" onClick="selectBouq(10);"></div>
						<div class="swiper-slide bouq" id="bouq11" onClick="selectBouq(11);"></div>
						<div class="swiper-slide bouq" id="bouq12" onClick="selectBouq(12);"></div>
						<div class="swiper-slide bouq" id="bouq13" onClick="selectBouq(13);"></div>
						<div class="swiper-slide bouq" id="bouq14" onClick="selectBouq(14);"></div>
						<div class="swiper-slide bouq" id="bouq15" onClick="selectBouq(15);"></div>
					</div>
				</div>
			</div>
		</div>
		<div id="display4" style="display:none;">
			<h1>LOGIN OR CREATE ACCOUNT</h1>
			<form name="form_login" id="form_login" method="post" action="{$link->getPageLink('authentication.php', true)}" class="mobilestep2">
				<p id="login_info" name="login_info"></p>
				<button type="button" class="bouqs-btn fblogin" id="btn_cart_fblogin" name="btn_cart_fblogin" onclick="fbLogin();"><div class="icon">f</div>FACEBOOK</button>

				<span>or</span>
				<input class="email required" type="email" id="login_email" placeholder="E-mail" name="login_email" value="" />
				<input class="required" type="password" minlength="5" id="login_password" placeholder="Password" name="login_password" value="" />
				<button type="button" id="submitLogin"class="bouqs-btn" onclick="loginAjax();">Login</button>

			</form>
		</div>
		<div id="display5" style="display:none;">
			<em>You&#39;ve selected</em>
			<h2 id="modal5ProductName"></h2>
			<em id="modal5CollectionName"></em>
			<div class="modal5ProductImage bouq" id=""></div>
			<div class="change" onclick="displayPage(3);">CHANGE YOUR PICK</div>
			<div class="confirm" onclick="closeModal();">CONFIRM SELECTION</div>
		</div>
	</div>
	
	<div class="m-footer">
		<footer id="modal-pagination" class="block fixed">
			<div id="page-selection"></div>
			
			<div id="back" class="arrow"><a href="javascript:displayPreviousPage();">&lt; PREV</a></div>
			<div id="forward" class="arrow"><a href="javascript:displayNextPage();">NEXT &gt;</a></div>
			
			<ul id="pagination">
				<li class="step active" id="step1" style="margin-left:25%;"><a href="javascript:void(0);">1</a></li>
				<li class="step" id="step2"><a href="javascript:void(0);">2</a></li>
				<li class="step" id="step3"><a href="javascript:void(0);">3</a></li>
				<li class="step" id="step5"><a href="javascript:void(0);">4</a></li>
			</ul>
			
		</footer>
	</div>
</div><!-- modal -->
</div>



<!-- ########################## -->
<!-- END DESKTOP LAYOUT / BEGIN MOBILE REPOSITIONING -->
<!-- ########################## -->


<div id="mobilepage"><!-- CSS for mobile layout (Line 154) -->
	<div id="m1" style="margin-top:20px;">
		<hgroup class="block fixed">
		<h3>WIN A FREE GRAND BOUQ<br>ENTER IN 4 EASY STEPS</h3>
		<h4>If your pick wins our MARCH BOUQNESS bracket&#44;<br>you win a free grand bouq&#33;</h4>
		</hgroup>
		<div id="fb-root"></div>
		<div class="fb-share-button" data-href="https://www.facebook.com/TheBouqs" data-width="120" data-type="button_count"></div>
		<div class="fb-facepile" data-href="https://www.facebook.com/TheBouqs" data-width="395" data-max-rows="1" data-colorscheme="light" data-size="large" data-show-count="true"></div>
		
		<script> /* Reinitialize FB when displayed in mobile layout */
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		</script>
	</div>
	<div id="m2" style="text-align:center;"><h3 style="display:block;text-align:center;">LOGIN TO GET STARTED</h3><!-- Append Login form from desktop layout (line 632) --></div>
	<div id="m3" style="margin-bottom:50px;"><h3 style="display:block;text-align:center;">PICK YOUR FAVORITE BOUQ</h3><!-- Append swiper from desktop layout (line 633) --></div>
	<div id="m6" style="text-align:center; ">
		
		<a href="#mobilelaststep" role="button" class="confirm" onclick="mobilelaststep();" style="background-color:#993399;padding:13px 7% 5px;font-family:'proxima_novaregular',Arial,sans-serif;color:#fff;font-size:20px;text-align:center;">CONFIRM SELECTION</div>
		
							
		<div id="coupon"><!-- this isn't displayed until the last function is triggered onclick 'Confirm' (line 638) -->
		<div class="fb-like" data-href="https://www.facebook.com/TheBouqs" data-width="125" data-height="35" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
		<span>SURPRISE&#33;</span>
		<span>Just for entering&#44; enjoy</span>
		<span><b>20&#37; OFF&#33;</b></span>
		<span>Use code &#34;SURPRISE&#34;</span>
		<span>&#64; CHECKOUT</span>
			<a href="/en/64-all" style="text-decoration:none;display:block;"><div class="shop">SHOP NOW</div></a>
		</div>
		
	</div>
	<script>
	
	$(window).resize(function() {
		/* Get login variable */
		var isLoggedIn = {if $cookie->isLoggedQuick()}1{else}0{/if};
		var responsive_viewport = $(window).width();
		/* Watch viewport size, breakpoint at 769, start repositioning */
		if (responsive_viewport < 769) {
			$("#m2").append( $( ".mobilestep2" ) );/* Reuse login form */
			$("#m3").append( $( ".swiper" ) );/* Reuse swiper */
		}
		
		/* Todo: If bouq selected and user logged in, onclick of 'Confirm' button should hide everything and display a new page with the coupon, facebook like, and 'ShOP NOW' button */
		/* Else: Confirm button is disabled and do nothing */
		function mobilelaststep() {
			if (selectedBouqId >= 0) {
				_gaq.push(['_trackEvent', campId, 'selection', customerId, selectedBouqId]);
				$("#m2").hide(); /* Hide everything */
				$("#m3").hide();
				$("#coupon").show(); /* Display block (Line 638) */
			} else { 
				$(".confirm").css("background-color:#898989;") }
		} 
		/* Initialize swiper */
		var mySwiper = new Swiper('.swiper-container',{
			calculateHeight:true,
			slidesPerView: 'auto',
			loop:true
		} );

	} );
	
	</script>
	
	
</div>