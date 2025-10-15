<?php

namespace App\Service;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class UsersManager
{
    public function __construct(
        private DocumentManager $documentManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function createUser(string $name, string $surname, string $email, string $password): ?User
    {
        $user = null;
        $existingUser = $this->findUserByEmail($email);
        if($existingUser == null){
            $user = new User(); 
            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $password
            );
            $user->setName($name)
                    ->setSurname($surname)
                    ->setEmail($email)
                    ->setPassword($hashedPassword);

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
        $user = null;
        $existingUser = $this->findUserByEmail($email);
        if($existingUser != null){
            $user = $this->findUserByEmail($email);
            if (!$this->passwordHasher->isPasswordValid($user, $password))
                $user = null;
        }
        return $user;
    }

}