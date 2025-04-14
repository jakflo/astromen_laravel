<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\ValidateAddOrEditForm;

class AstromenList extends Controller
{
    public function __construct(
        protected \App\Models\AstromenList $model, 
        protected \App\Models\Skill $skillModel

    )
    {
        
    }
    
    public function render(Request $request) 
    {
        $astromen = $this->model->getList();
        $oldFormValues = $request->session()->all()['_old_input'] ?? [];
        
        return Inertia::render('astromen_list/main', [
            'astromen' => $this->model->processCollection($astromen), 
            'aviableSkills' => $this->skillModel->getList(), 
            'csrf' => csrf_token(), 
            'oldFormValues' => $oldFormValues, 
            'flashStatus' => $request->session()->all()['status'] ?? null
        ]);
    }
    
    public function astromanExists(Request $request)
    {
        $query = $request->query();
        return response()->json(['response' => $this->model->isAstromanExists(
            $query['id'], 
            trim($query['first_name']), 
            trim($query['last_name']), 
            $query['dob']
        )]);
    }
    
    public function editFormSent(ValidateAddOrEditForm $validator)
    {
        $data = $validator->validated();
        $this->model->editAstroman((int)$data['id'], $data['first_name'], $data['last_name'], $data['DOB'], $data['skill']);
        $validator->session()->flash('status', "Astronaut {$data['first_name']} {$data['last_name']} editován.");
        return redirect('/');
    }
    
    public function newFormSent(ValidateAddOrEditForm $validator)
    {
        $data = $validator->validated();
        $this->model->addNewAstroman($data['first_name'], $data['last_name'], $data['DOB'], $data['skill']);
        $validator->session()->flash('status', "Astronaut {$data['first_name']} {$data['last_name']} vytvořen.");
        return redirect('/');
    }
    
}
