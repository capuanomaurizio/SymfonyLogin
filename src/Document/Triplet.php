<?php

namespace App\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ODM\Document(collection: 'triplets')]
class Triplet
{
    #[ODM\Id]
    #[Groups(['process:read'])]
    private ?string $id = null;

    #[ODM\ReferenceOne(storeAs: 'dbRef', targetDocument: Functionality::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Functionality $f1;

    #[ODM\ReferenceOne(storeAs: 'dbRef', targetDocument: Functionality::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Functionality $f2;

    #[ODM\ReferenceOne(storeAs: 'dbRef', targetDocument: Functionality::class, cascade: ['persist', 'remove'])]
    #[Groups(['process:read'])]
    private Functionality $f3;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getF1(): Functionality
    {
        return $this->f1;
    }

    public function setF1(Functionality $f1): Triplet
    {
        $this->f1 = $f1;
        return $this;
    }

    public function getF2(): Functionality
    {
        return $this->f2;
    }

    public function setF2(Functionality $f2): Triplet
    {
        $this->f2 = $f2;
        return $this;
    }

    public function getF3(): Functionality
    {
        return $this->f3;
    }

    public function setF3(Functionality $f3): Triplet
    {
        $this->f3 = $f3;
        return $this;
    }

}
