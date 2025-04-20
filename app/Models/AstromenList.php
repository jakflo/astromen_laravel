<?php
namespace App\Models;

use Illuminate\Support\Facades\DB;
use App\EloquentModels\Astroman;

class AstromenList
{
    public function __construct(
        protected Skill $skillModel
    )
    {
        
    }
    
    public function getList(int $itemsPerPage)
    {
        return Astroman::paginate($itemsPerPage)->onEachSide(1);
    }
    
    public function getCount(): int
    {
        return Astroman::all()->count();
    }
    
    public function getAstroman(int $id): Astroman|null
    {
        return Astroman::find($id);
    }
    
    public function processCollection($collection)
    {
        $list = [];
        foreach ($collection as $row) {
            $rowProccesed = $row->getAttributes();
            $rowProccesed['dobCz'] = date('d. m. Y', strtotime($row->DOB));
            $rowProccesed['skills'] = $this->markSkillsSourceAsDatabase($row->skills->getIterator()->getArrayCopy());
            $rowProccesed['skill_names'] = array_map(function($item){
                return $item->name;
            }, $rowProccesed['skills']);
            
            $list[] = $rowProccesed;
        }
        
        return $list;
    }
    
    public function isAstromanExists($notId, $firstName, $lastName, $dob)
    {
        $query = DB::query()
            ->from('astroman')
            ->where('first_name', '=', $firstName)
            ->where('last_name', '=', $lastName)
            ->where('DOB', '=', $dob)
        ;
        if ($notId != 0) {
            $query->where('id', '!=', $notId);
        }
        return $query->limit(1)->get()->count();
    }
    
    public function editAstroman(int $id, string $firstName, string $lastName, string $dob, array $skills)
    {
        $astroman = Astroman::find($id);
        if (!$astroman) {
            throw new \Exception('Astronaut nenalezen');
        }
        
        $astroman->first_name = trim($firstName);
        $astroman->last_name = trim($lastName);
        $astroman->DOB = $dob;
        $astroman->save();
        
        $skillsProcessed = $this->skillModel->processFormArray($skills);
        if (count($skillsProcessed['newSkillsName']) !== 0 || $this->skillModel->skillsChanged($id, $skillsProcessed['selectedSkillsId']) ) {
            $this->skillModel->removeSkillsFromAstroman($id);
            $this->skillModel->addSkillsToAstroman($id, $skillsProcessed['selectedSkillsId'], $skillsProcessed['newSkillsName']);
        }
    }
    
    public function addNewAstroman(string $firstName, string $lastName, string $dob, array $skills)
    {
        $astroman = new Astroman();
        
        $astroman->first_name = trim($firstName);
        $astroman->last_name = trim($lastName);
        $astroman->DOB = $dob;
        $astroman->save();
        
        $id = $astroman->id;
        $skillsProcessed = $this->skillModel->processFormArray($skills);
        $this->skillModel->addSkillsToAstroman($id, $skillsProcessed['selectedSkillsId'], $skillsProcessed['newSkillsName']);
    }
    
    public function deleteAstroman(int $id)
    {
        $astroman = $this->getAstroman($id);
        if ($astroman === null) {
            throw new \Exception('Astroman not found');
        }
        
        $this->skillModel->removeSkillsFromAstroman($id);
        $astroman->delete();
    }
    
    protected function markSkillsSourceAsDatabase(array $skills): array
    {
        foreach ($skills as &$skillItem) {
            $skillItem->source = 'database';
        }
        
        return $skills;
    }
    
}
