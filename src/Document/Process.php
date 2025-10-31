<?php

namespace App\Document;

use App\Repository\ProcessesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'processes',repositoryClass: ProcessesRepository::class)]
class Process
{
    #[ODM\Id]
    #[Groups(['process:read'])]
    private ?string $id = null;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $name;

    #[ODM\Field(type: 'string')]
    #[Groups(['process:read'])]
    private string $contextInformation;

    #[ODM\Field(type: 'date')]
    #[Groups(['process:read'])]
    private ?\DateTime $creationDate;

    #[ODM\Field(type: 'date')]
    #[Groups(['process:read'])]
    private ?\DateTime $expirationDate = null;

    #[ODM\ReferenceOne(storeAs: 'dbRef', targetDocument: Component::class)]
    #[Groups(['process:read'])]
    private ?Component $component;

    #[ODM\ReferenceMany(storeAs: 'dbRef', targetDocument: RootRequirement::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Collection $requirements;

    public function __construct()
    {
        $this->creationDate = new \DateTime();
        $this->requirements = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(?string $id): Process
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Process
    {
        $this->name = $name;
        return $this;
    }

    public function getContextInformation(): string
    {
        return $this->contextInformation;
    }

    public function setContextInformation(string $contextInformation): Process
    {
        $this->contextInformation = $contextInformation;
        return $this;
    }

    public function getCreationDate(): ?\DateTime
    {
        return $this->creationDate;
    }

    public function getExpirationDate(): ?\DateTime
    {
        return $this->expirationDate;
    }

    public function setExpirationDate(?\DateTime $expirationDate): Process
    {
        $this->expirationDate = $expirationDate;
        return $this;
    }


    public function getComponent(): ?Component
    {
        return $this->component;
    }

    public function setComponent(?Component $main_component): Process
    {
        $this->component = $main_component;
        return $this;
    }

    public function getRequirements(): Collection
    {
        return $this->requirements;
    }

    public function addRequirement(RootRequirement $requirement): Process
    {
        if(!$this->requirements->contains($requirement)){
            $this->requirements->add($requirement);
        }
        return $this;
    }

}
