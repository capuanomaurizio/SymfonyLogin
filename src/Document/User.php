<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;

#[ODM\Document(collection: 'users')]
class User
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

    #[ODM\Field(type: 'date')]
    private \DateTime $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
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
    
    public function setCreatedAt(\DateTime $createdAt): self 
    { 
        $this->createdAt = $createdAt; 
        return $this; 
    }
}