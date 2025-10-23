<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Service\DatabaseManager;

class UsersController extends AbstractController
{
    public function __construct(
        private readonly DatabaseManager $databaseManager,
    ){}

    #[Route('/user/homepage', name: 'homepage')]
    public function homepage(#[CurrentUser] ?User $user): Response
    {
        if (!$user)
            return $this->redirectToRoute('index');
        return $this->render("homepage.html.twig", ["user" => $user]);
    }

    #[Route('/user/userslist', name: 'users_list')]
    public function usersList(#[CurrentUser] ?User $user): Response
    {
        if (!$user)
            return $this->redirectToRoute('index');
        return $this->render("users-list.html.twig");
    }

    #[Route('/user/{userId}', name: 'user_profile')]
    public function userProfile(#[CurrentUser] ?User $admin, string $userId): Response
    {
        if (!$admin || !in_array('ADMIN_USER', $admin->getRoles()))
            return $this->redirectToRoute('index');
        return $this->render("user-profile.html.twig", ["user" => $this->json($this->databaseManager->getUser($userId))->getContent()]);
    }
}
