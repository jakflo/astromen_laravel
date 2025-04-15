<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ValidateDeleteForm extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    
    public function rules(): array
    {
        return [
            'id' => 'bail|required|integer|exists:astroman,id'
        ];
    }
    
}
