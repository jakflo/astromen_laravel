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
    
    public function getList()
    {
        return Astroman::all();
        
//        return DB::query()
//                ->selectRaw("astroman.*, GROUP_CONCAT(skill.name SEPARATOR ', ') AS skill_names, GROUP_CONCAT(skill.id SEPARATOR ', ') AS skill_ids")
//                ->from('astroman')
//                ->join('astroman_has_skill', 'astroman.id', '=', 'astroman_has_skill.astroman_id')
//                ->join('skill', 'skill.id', '=', 'astroman_has_skill.skill_id')
//                ->groupBy('astroman.id')
//                ->get()
//                ;
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
        
        $astroman->first_name = $firstName;
        $astroman->last_name = $lastName;
        $astroman->DOB = $dob;
        $astroman->save();
        
        $skillsProcessed = $this->skillModel->processFormArray($skills);
        if (count($skillsProcessed['newSkillsName']) !== 0 || $this->skillModel->skillsChanged($id, $skillsProcessed['selectedSkillsId']) ) {
            $this->skillModel->removeSkillsFromAstroman($id);
            $this->skillModel->addSkillsToAstroman($id, $skillsProcessed['selectedSkillsId'], $skillsProcessed['newSkillsName']);
        }
    }
    
    protected function markSkillsSourceAsDatabase(array $skills): array
    {
        foreach ($skills as &$skillItem) {
            $skillItem->source = 'database';
        }
        
        return $skills;
    }
    
}
