<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('image',100)->nullable();
            $table->string('name',100)->nullable();
            $table->string('fname')->nullable();
             $table->string('lname')->nullable();
            $table->string('email',100)->unique();
            $table->string('role',30)->default('alumni');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password',255);
            $table->enum('status',['active','inactive'])->default('active');
            $table->rememberToken();
            $table->timestamps();
        });

       
        DB::table('users')->insert(
            array(
                'name' => "Shandy Padere",
                'email' => 'occ_alumni@gmail.com',
                'role' => 'admin',
                'password' => bcrypt('123456'),
                'status' => 'active',
            )
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
