<?php

namespace App\Service;

use App\Document\User;
use Doctrine\ODM\MongoDB\DocumentManager;

class DatabaseManager
{
    public function __construct(
        private DocumentManager $documentManager
    ) {
        $this->documentManager = $this->documentManager->getDefaultManager();
    }

    public function getUser(string $userId): ?User
    {
        return $this->documentManager->getRepository(User::class)->findOneBy(['email' => $userId]);
    }

    public function createUser($userData, $passwordHasher): User
    {
        $user = new User();
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $userData->get('plainPassword')
        );
        $user->setName($userData->get('name'))
            ->setSurname($userData->get('surname'))
            ->setEmail($userData->get('email'))
            ->setPassword($hashedPassword)
            ->setRoles(['BASE_USER']);
        $this->documentManager->persist($user);
        $this->documentManager->flush();
        return $user;
    }
}
