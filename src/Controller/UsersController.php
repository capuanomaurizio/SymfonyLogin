<?php

declare(strict_types=1);

namespace App\Controller;

use App\Document\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UsersController extends AbstractController
{
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
}
