<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_log_in_through_the_admin_endpoint(): void
    {
        User::factory()->create([
            'email' => 'admin@bpoready.com',
            'password' => Hash::make('Admin@12345'),
            'role' => 'super_admin',
        ]);

        $this->postJson('/api/admin/login', [
            'email' => 'admin@bpoready.com',
            'password' => 'Admin@12345',
        ])->assertOk()
            ->assertJsonPath('user.role', 'super_admin')
            ->assertJsonPath('user.email', 'admin@bpoready.com');
    }

    public function test_regular_users_cannot_use_the_admin_endpoint(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $this->postJson('/api/admin/login', [
            'email' => 'user@example.com',
            'password' => 'password',
        ])->assertUnauthorized();
    }

    public function test_admin_user_summary_returns_the_database_count(): void
    {
        User::factory()->count(4)->create();

        $this->getJson('/api/admin/users')
            ->assertOk()
            ->assertJsonPath('total', 4)
            ->assertJsonCount(4, 'users');
    }

    public function test_super_admin_can_create_an_admin_account(): void
    {
        User::factory()->create([
            'email' => 'admin@bpoready.com',
            'password' => Hash::make('Admin@12345'),
            'role' => 'super_admin',
        ]);

        $this->postJson('/api/admin/accounts', [
            'creator_email' => 'admin@bpoready.com',
            'current_password' => 'Admin@12345',
            'name' => 'Content Admin',
            'email' => 'content@bpoready.com',
            'password' => 'Content@12345',
            'password_confirmation' => 'Content@12345',
        ])->assertCreated()
            ->assertJsonPath('user.role', 'admin');

        $this->assertDatabaseHas('users', [
            'email' => 'content@bpoready.com',
            'role' => 'admin',
        ]);
    }

    public function test_non_super_admin_cannot_create_an_admin_account(): void
    {
        User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $this->postJson('/api/admin/accounts', [
            'creator_email' => 'user@example.com',
            'current_password' => 'password',
            'name' => 'Unauthorized Admin',
            'email' => 'unauthorized@bpoready.com',
            'password' => 'Password@123',
            'password_confirmation' => 'Password@123',
        ])->assertForbidden();
    }
}