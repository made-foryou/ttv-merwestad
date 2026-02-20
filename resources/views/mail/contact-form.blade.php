<x-mail::message>
# Nieuw bericht via contactformulier

Er is een nieuw bericht binnengekomen via het contactformulier op de website.

**Naam:** {{ $contactName }}

**E-mailadres:** {{ $contactEmail }}

**Bericht:**

{{ $contactMessage }}

<x-mail::button :url="'mailto:' . $contactEmail">
Reageer op {{ $contactName }}
</x-mail::button>

Met vriendelijke groet,<br>
{{ config('app.name') }}
</x-mail::message>
