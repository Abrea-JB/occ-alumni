<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToArray;

class StudentsImport implements ToArray
{
    public function array(array $array)
    {
        return $array;
    }
}