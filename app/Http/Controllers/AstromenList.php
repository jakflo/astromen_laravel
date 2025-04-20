<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use \Illuminate\Http\RedirectResponse;
use App\Http\Requests\ValidateAddOrEditForm;
use App\Http\Requests\ValidateDeleteForm;

class AstromenList extends Controller
{
    protected int $itemsPerPage = 15;
    
    public function __construct(
        protected \App\Models\AstromenList $model, 
        protected \App\Models\Skill $skillModel
    )
    {
        
    }
    
    public function render(Request $request): \Inertia\Response
    {
        $paginator = $this->model->getList($this->itemsPerPage);
        $oldFormValues = $request->session()->all()['_old_input'] ?? [];
        
        return Inertia::render('astromen_list/main', [
            'astromen' => $this->model->processCollection($paginator), 
            'aviableSkills' => $this->skillModel->getList(), 
            'csrf' => csrf_token(), 
            'oldFormValues' => $oldFormValues, 
            'flashStatus' => $request->session()->all()['status'] ?? null, 
            'paginator' => $paginator
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
    
    public function editFormSent(ValidateAddOrEditForm $validator): RedirectResponse
    {
        $data = $validator->validated();
        $this->model->editAstroman((int)$data['id'], $data['first_name'], $data['last_name'], $data['DOB'], $data['skill']);
        $validator->session()->flash('status', "Astronaut {$data['first_name']} {$data['last_name']} editován.");
        return $this->redirectToHomepageWithPage($data['page']);
    }
    
    public function newFormSent(ValidateAddOrEditForm $validator): RedirectResponse
    {
        $data = $validator->validated();
        $this->model->addNewAstroman($data['first_name'], $data['last_name'], $data['DOB'], $data['skill']);
        $validator->session()->flash('status', "Astronaut {$data['first_name']} {$data['last_name']} vytvořen.");
        return $this->redirectToHomepageWithLastPage();
    }
    
    public function deleteFormSent(ValidateDeleteForm $validator): RedirectResponse
    {
        $data = $validator->validated();
        $oldAstromanData = $this->model->getAstroman((int)$data['id']);
        $this->model->deleteAstroman((int)$data['id']);
        $validator->session()->flash('status', "Astronaut {$oldAstromanData->first_name} {$oldAstromanData->last_name} vymazán.");
        return $this->redirectToHomepageWithPage($data['page']);
    }
    
    protected function redirectToHomepageWithPage(int $pageNumber): RedirectResponse
    {
        $urlParams = $pageNumber > 1 ? ['page' => $pageNumber] : [];
        return redirect()->route('home', $urlParams);
    }
    
    protected function redirectToHomepageWithLastPage(): RedirectResponse
    {
        $lastPage = ceil($this->model->getCount() / $this->itemsPerPage);
        $urlParams = $lastPage > 1 ? ['page' => $lastPage] : [];
        return redirect()->route('home', $urlParams);
    }
    
}
