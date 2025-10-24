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
            $table->enum('role',['player','coach','treasurer','admin'])->default('player');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password',255);
            $table->enum('status',['active','inactive'])->default('active');
            $table->rememberToken();
            $table->timestamps();
        });

        // DB::table('users')->insert(
        //     array(
        //         'name' => "Emily Allard",
        //         'email' => 'faculty1@gmail.com',
        //         'role' => 'faculty',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Ann A. Crabtree",
        //         'email' => 'faculty2@gmail.com',
        //         'role' => 'faculty',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Michelle H. Scott",
        //         'email' => 'faculty3@gmail.com',
        //         'role' => 'faculty',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Edward J. Meserve",
        //         'email' => 'faculty4@gmail.com',
        //         'role' => 'faculty',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Allen A. Ngo",
        //         'email' => 'student1@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Ronald L. Leonard",
        //         'email' => 'student2@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Billie D. Straw",
        //         'email' => 'student3@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Gary I. Lester",
        //         'email' => 'student4@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Beverly S. Vazquez",
        //         'email' => 'student5@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Gregg J. Price",
        //         'email' => 'student6@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Bruce C. Baltzell",
        //         'email' => 'student7@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Winston L. Arnold",
        //         'email' => 'student8@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Doris J. Hedrick",
        //         'email' => 'student9@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Patrick L. Roberson",
        //         'email' => 'student10@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Andre C. Holman",
        //         'email' => 'student11@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Max K. Taylor",
        //         'email' => 'student12@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Patricia E. Martinez",
        //         'email' => 'student13@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Charles T. Garcia",
        //         'email' => 'student14@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Timmy B. Jones",
        //         'email' => 'student15@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Sonny E. Olson",
        //         'email' => 'student16@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Carol W. Ringo",
        //         'email' => 'student17@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Rhonda K. Stroud",
        //         'email' => 'student18@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Patricia A. Garrett",
        //         'email' => 'student19@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        // DB::table('users')->insert(
        //     array(
        //         'name' => "Erik K. Kirby",
        //         'email' => 'student20@gmail.com',
        //         'role' => 'student',
        //         'password' => bcrypt('123456'),
        //         'status' => 'active',
        //     )
        // );
        DB::table('users')->insert(
            array(
                'name' => "Niel M. Daculan",
                'email' => 'admin@gmail.com',
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
