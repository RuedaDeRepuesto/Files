<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class File extends Model
{
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'filename',
        'extension',
        'desc',
        'size',
        'mime',
        'file',
        'user_id'
    ];


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['size_mb'];


    /**
     * Tamaño en Mb
     *
     * @return string
     */
    public function getSizeMbAttribute()
    {
        return  round($this->size/1000000,2) . "Mb";
    }
}
