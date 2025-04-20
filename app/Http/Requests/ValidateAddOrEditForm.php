<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\AstromenList;
use App\Models\Skill;

class ValidateAddOrEditForm extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => 'bail|required|integer', 
            'page' => 'nullable|integer', 
            'first_name' => 'bail|required|string|max:32', 
            'last_name' => 'bail|required|string|max:32', 
            'DOB' => 'bail|required|date', 
            'skill' => 'bail|required|array'
        ];
    }
    
    public function after(AstromenList $astromenModel, Skill $skillModel): array
    {
        return [
            function(Validator $validator) use($astromenModel) {
            if ($astromenModel->isAstromanExists(
                    (int)$validator->getValue('id'), 
                    trim($validator->getValue('first_name')), 
                    trim($validator->getValue('last_name')), 
                    $validator->getValue('DOB'))
                    ) {
                    $validator->errors()->add('id', 'Astronaut již existuje');
                }
            }, 
            function(Validator $validator) use($astromenModel) {
                if ($validator->getValue('id') != 0 && $astromenModel->getAstroman((int)$validator->getValue('id')) === null) {
                    $validator->errors()->add('id', 'Astronaut nenalezen');
                }
            }, 
            function(Validator $validator) use($skillModel) {
                $skills = $skillModel->processFormArray($validator->getValue('skill'));
                if (!$skillModel->skillsExist($skills['selectedSkillsId'])) {
                    $validator->errors()->add('skill', 'Dovednost nenalezena');
                }
            }
        ];
    }
    
}
