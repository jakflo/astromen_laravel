<?php
namespace App\EloquentModels;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Astroman extends Model
{
    protected $table = 'astroman';
    public $timestamps = false;
    
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, AstromanHasSkill::class);
    }
    
}
