<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DownloadProgress extends Model
{
    protected $primaryKey = 'key';
    public    $incrementing = false;
    protected $keyType      = 'string';

    protected $fillable = ['key', 'version_id', 'percent', 'status', 'error'];
}