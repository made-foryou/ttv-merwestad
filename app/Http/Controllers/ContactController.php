<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactFormMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Handle the incoming contact form submission.
     */
    public function __invoke(ContactRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Mail::to('info@ttvmerwestad.nl')->send(new ContactFormMail(
            contactName: $validated['name'],
            contactEmail: $validated['email'],
            contactMessage: $validated['message'],
        ));

        return back()->with('success', 'Je bericht is verstuurd!');
    }
}
