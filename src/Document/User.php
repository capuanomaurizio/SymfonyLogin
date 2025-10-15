<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ODM\Document(collection: 'users')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ODM\Id]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    private string $name;

    #[ODM\Field(type: 'string')]
    private string $surname;

    #[ODM\Field(type: 'string')]
    private string $email;

    #[ODM\Field(type: 'string')]
    private string $password;

    #[ODM\Field(type: 'collection')]
    private array $roles = [];

    #[ODM\Field(type: 'date')]
    private \DateTime $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    // Getters
    public function getId(): ?string 
    { 
        return $this->id; 
    }
    
    public function getName(): string 
    { 
        return $this->name; 
    }
    
    public function getSurname(): string 
    { 
        return $this->surname; 
    }
    
    public function getEmail(): string 
    { 
        return $this->email; 
    }
    
    public function getPassword(): string 
    { 
        return $this->password; 
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }
    
    public function getCreatedAt(): \DateTime 
    { 
        return $this->createdAt; 
    }

    // Setters
    public function setName(string $name): self 
    { 
        $this->name = $name; 
        return $this; 
    }
    
    public function setSurname(string $surname): self 
    { 
        $this->surname = $surname; 
        return $this; 
    }
    
    public function setEmail(string $email): self 
    { 
        $this->email = $email; 
        return $this; 
    }
    
    public function setPassword(string $password): self 
    { 
        $this->password = $password; 
        return $this; 
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }
    
    public function setCreatedAt(\DateTime $createdAt): self 
    { 
        $this->createdAt = $createdAt; 
        return $this; 
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // For example: $this->plainPassword = null;
    }
}