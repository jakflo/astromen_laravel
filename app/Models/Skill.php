<?php
namespace App\Models;

use App\EloquentModels\Skill as SkillEloquent;
use App\EloquentModels\AstromanHasSkill as AstromanHasSkillEloquent;
use Illuminate\Support\Facades\DB;

class Skill
{
    public function getList()
    {
        return SkillEloquent::all();
    }
    
    public function processFormArray(array $formArray): array
    {
        $selectedSkillsId = [];
        $newSkillsName = [];
        
        foreach ($formArray as $key => $value) {
            if (is_numeric($key) && $value === 'on') {
                $selectedSkillsId[] = (int)$key;
            } elseif(strpos($key, 'selected_id') !== false && $value != 0) {
                $selectedSkillsId[] = (int)$value;
            } elseif(strpos($key, 'new_id') !== false && !empty(trim($value))) {
                $newSkillsName[] = trim($value);
            }
        }
        
        $selectedSkillsId = array_unique($selectedSkillsId);
        $newSkillsName = array_unique($newSkillsName);
        sort($selectedSkillsId);
        sort($newSkillsName);
        
        return [
            'selectedSkillsId' => $selectedSkillsId, 
            'newSkillsName' => $newSkillsName
        ];
    }
    
    public function skillsExist(array $skillsId): bool
    {
        $foundSkills = DB::query()
            ->from('skill')
            ->whereIn('id', $skillsId)
            ->get()
            ->count()
        ;
        
        return $foundSkills === count($skillsId);
    }
    
    public function skillsChanged(int $astromanId, array $skillsId): bool
    {
        $skillsId = array_map(function($skill) {
            return (int)$skill;            
        }, $skillsId);
        $skillsId = array_values(array_unique($skillsId));
        sort($skillsId);
        
        $skillsInDB = AstromanHasSkillEloquent::query()->where('astroman_id', '=', $astromanId)->get();
        $skillsIdInDB = array_column($skillsInDB->toArray(), 'skill_id');
        sort($skillsIdInDB);
        
        return json_encode($skillsId) !== json_encode($skillsIdInDB);
    }
    
    public function removeSkillsFromAstroman(int $astromanId)
    {
        DB::delete("DELETE FROM astroman_has_skill WHERE astroman_id = :aid", ['aid' => $astromanId]);
    }
    
    public function addSkillsToAstroman(int $astromanId, array $skillsId, array $newSkillsName)
    {
        $newRows = [];
        foreach ($skillsId as $itemId) {
            $newRows[] = ['astroman_id' => $astromanId, 'skill_id' => $itemId];
        }
        foreach ($newSkillsName as $itemName) {
            $newRows[] = ['astroman_id' => $astromanId, 'skill_id' => $this->findOrCreateNewSkill($itemName)];
        }
        
        array_multisort($newRows, SORT_ASC, SORT_REGULAR, array_column($newRows, 'skill_id'));
        DB::table('astroman_has_skill')->insert($newRows);
    }
    
    protected function findOrCreateNewSkill(string $skillName): int
    {
        $skillName = trim($skillName);
        $foundId = DB::scalar("SELECT id FROM skill WHERE name = :nm", ['nm' => $skillName]);
        if ($foundId) {
            return $foundId;
        }
        
        $newSkill = new SkillEloquent();
        $newSkill->name = $skillName;
        $newSkill->save();
        
        return $newSkill->id;
    }
    
}
