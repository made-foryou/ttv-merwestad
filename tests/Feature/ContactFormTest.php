<?php

use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Mail;

test('contact form sends an email', function () {
    Mail::fake();

    $response = $this->post(route('contact.store'), [
        'name' => 'Jan de Vries',
        'email' => 'jan@voorbeeld.nl',
        'message' => 'Ik wil graag lid worden van de vereniging.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    Mail::assertSent(ContactFormMail::class, function (ContactFormMail $mail) {
        return $mail->hasTo('info@ttvmerwestad.nl')
            && $mail->hasReplyTo('jan@voorbeeld.nl');
    });
});

test('contact form validates required fields', function () {
    $response = $this->post(route('contact.store'), []);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
});

test('contact form validates email format', function () {
    $response = $this->post(route('contact.store'), [
        'name' => 'Jan de Vries',
        'email' => 'niet-een-email',
        'message' => 'Testbericht.',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('contact form is rate limited', function () {
    Mail::fake();

    for ($i = 0; $i < 5; $i++) {
        $this->post(route('contact.store'), [
            'name' => 'Jan',
            'email' => 'jan@voorbeeld.nl',
            'message' => 'Bericht '.$i,
        ]);
    }

    $response = $this->post(route('contact.store'), [
        'name' => 'Jan',
        'email' => 'jan@voorbeeld.nl',
        'message' => 'Dit moet geblokkeerd worden.',
    ]);

    $response->assertStatus(429);
});
