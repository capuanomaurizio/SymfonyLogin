<?php

namespace App\Service;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;

class UsersManager
{
    public function __construct(
        private DocumentManager $documentManager
    ) {}

    public function createUser(string $name, string $surname, string $email, string $password): ?User
    {
        $user = null;
        $existingUser = $this->findUserByEmail($email);
        if($existingUser == null){
            $user = new User(); 
            $user->setName($name)
                    ->setSurname($surname)
                    ->setEmail($email)
                    ->setPassword($password);

            $this->documentManager->persist($user);
            $this->documentManager->flush();
        }
        return $user;
    }

    public function findUserByEmail(string $email): ?User
    {
        return $this->documentManager->getRepository(User::class)
            ->findOneBy(['email' => $email]);
    }

    public function checkUserCredentials(string $email, string $password): ?User
    {
        return $this->documentManager->getRepository(User::class)
            ->findOneBy(['email' => $email, 'password' => $password]);
    }

}